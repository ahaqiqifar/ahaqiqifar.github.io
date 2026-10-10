import { useEffect, useRef, useState } from 'react'

/*
 * Animated connectome seen from above (axial view): regions sampled inside two hemispheres,
 * short-range edges to neighbours plus long-range "fibre tract" edges, and packets of
 * information travelling along edges. A region that receives a packet lights up and may pass
 * it on, so activity cascades through the network. The pointer stimulates nearby regions; with
 * `resectable`, clicking a region removes it (a virtual resection) and activity reroutes around it.
 */

type Node = { x: number; y: number; deg: number; act: number; cut: boolean }
type Edge = { a: number; b: number; cx: number; cy: number; long: boolean }
type Packet = { e: number; dir: 1 | -1; t: number; speed: number }

const CREAM = '239,238,233'

// small deterministic PRNG so the network looks the same on every visit
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Brain outline in normalised coords (y = -1 frontal pole, +1 occipital pole). Each hemisphere is
// flat on its medial side (along the longitudinal fissure) and a rounded superellipse laterally,
// slightly wider at the back, so the poles are rounded with a small notch between hemispheres.
const HEMI = { fissure: 0.022, rx: 0.4, cy: 0.02, ry: 0.98, lateral: 2.2, medial: 7, q: 2.1 }
const hemiRx = (y: number) => HEMI.rx * (1 + 0.08 * y)
const inside = (x: number, y: number) => {
  const ax = Math.abs(x)
  if (ax < HEMI.fissure + 0.02) return false
  const u = (ax - HEMI.fissure) / hemiRx(y) - 1 // -1 at the fissure, +1 at the lateral edge
  const p = u < 0 ? HEMI.medial : HEMI.lateral
  const v = Math.abs((y - HEMI.cy) / HEMI.ry)
  return Math.abs(u) ** p + v ** HEMI.q <= 0.9
}

function buildNetwork(count: number) {
  const rand = rng(20260708)
  const nodes: Node[] = []
  const minD = 0.105
  for (let tries = 0; nodes.length < count && tries < 20000; tries++) {
    const x = (rand() * 2 - 1) * 0.86
    const y = rand() * 1.9 - 0.95
    if (!inside(x, y)) continue
    if (nodes.some((n) => (n.x - x) ** 2 + (n.y - y) ** 2 < minD * minD)) continue
    nodes.push({ x, y, deg: 0, act: 0, cut: false })
  }

  const edges: Edge[] = []
  const has = new Set<string>()
  const add = (a: number, b: number, long: boolean) => {
    const k = a < b ? `${a}-${b}` : `${b}-${a}`
    if (a === b || has.has(k)) return
    has.add(k)
    const A = nodes[a], B = nodes[b]
    // long edges bow towards the midline like fibre bundles
    const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2
    const bow = long ? 0.55 : 0
    edges.push({ a, b, cx: mx * (1 - bow), cy: my, long })
    A.deg++
    B.deg++
  }

  // local wiring: 3 nearest neighbours in the same hemisphere
  nodes.forEach((n, i) => {
    nodes
      .map((m, j) => ({ j, d: (m.x - n.x) ** 2 + (m.y - n.y) ** 2, same: Math.sign(m.x) === Math.sign(n.x) }))
      .filter((o) => o.j !== i && o.same)
      .sort((p, q) => p.d - q.d)
      .slice(0, 3)
      .forEach((o) => add(i, o.j, false))
  })

  // inter-hemispheric (homotopic) connections through the corpus callosum
  for (let k = 0; k < 14; k++) {
    const i = Math.floor(rand() * nodes.length)
    const n = nodes[i]
    let best = -1, bd = Infinity
    nodes.forEach((m, j) => {
      if (Math.sign(m.x) === Math.sign(n.x)) return
      const d = (m.x + n.x) ** 2 + (m.y - n.y) ** 2
      if (d < bd) { bd = d; best = j }
    })
    if (best >= 0) add(i, best, true)
  }

  // long-range intra-hemispheric tracts (fronto-parietal / fronto-occipital)
  for (let k = 0; k < 12; k++) {
    const i = Math.floor(rand() * nodes.length)
    const n = nodes[i]
    const far = nodes
      .map((m, j) => ({ j, ok: Math.sign(m.x) === Math.sign(n.x) && Math.abs(m.y - n.y) > 0.8 }))
      .filter((o) => o.ok)
    if (far.length) add(i, far[Math.floor(rand() * far.length)].j, true)
  }

  const adj: number[][] = nodes.map(() => [])
  edges.forEach((e, k) => {
    adj[e.a].push(k)
    adj[e.b].push(k)
  })
  return { nodes, edges, adj }
}

const bez = (p0: number, c: number, p1: number, t: number) => (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * c + t * t * p1

type Props = { className?: string; nodes?: number; resectable?: boolean }

export default function BrainNetwork({ className = '', nodes: count = 150, resectable = false }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [cuts, setCuts] = useState(0)
  const resetRef = useRef(() => {})

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const { nodes, edges, adj } = buildNetwork(count)
    const maxDeg = Math.max(...nodes.map((n) => n.deg))
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const packets: Packet[] = []
    const pointer = { x: 0, y: 0, on: false }
    let W = 0, H = 0, S = 1, OX = 0, OY = 0
    let raf = 0, visible = true, last = performance.now(), spawnAcc = 0

    const toPx = (x: number, y: number) => [OX + x * S, OY + y * S] as const

    function resize() {
      const r = canvas.getBoundingClientRect()
      const dpr = Math.min(devicePixelRatio || 1, 2)
      W = r.width
      H = r.height
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      S = Math.min(W / 1.75, H / 2.1)
      OX = W / 2
      OY = H / 2
      if (reduced) draw()
    }

    const live = (e: Edge) => !nodes[e.a].cut && !nodes[e.b].cut

    function emit(from: number) {
      if (nodes[from].cut) return
      const list = adj[from].filter((k) => live(edges[k]))
      if (!list.length || packets.length > 60) return
      const e = list[Math.floor(Math.random() * list.length)]
      const edge = edges[e]
      packets.push({ e, dir: edge.a === from ? 1 : -1, t: 0, speed: edge.long ? 0.55 : 1.1 })
    }

    function outline() {
      ctx.strokeStyle = `rgba(${CREAM},0.14)`
      ctx.lineWidth = 1
      for (const side of [-1, 1]) {
        ctx.beginPath()
        for (let k = 0; k <= 200; k++) {
          const th = (2 * Math.PI * k) / 200
          const c = Math.cos(th), sn = Math.sin(th)
          const y = HEMI.cy + HEMI.ry * Math.sign(sn) * Math.abs(sn) ** (2 / HEMI.q)
          const u = Math.sign(c) * Math.abs(c) ** (2 / (c < 0 ? HEMI.medial : HEMI.lateral))
          const x = HEMI.fissure + hemiRx(y) * (1 + u)
          const [px, py] = toPx(side * x, y)
          k ? ctx.lineTo(px, py) : ctx.moveTo(px, py)
        }
        ctx.closePath()
        ctx.stroke()
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)
      outline()

      for (const e of edges) {
        if (!live(e)) continue
        const A = nodes[e.a], B = nodes[e.b]
        const act = Math.max(A.act, B.act)
        ctx.strokeStyle = `rgba(${CREAM},${(e.long ? 0.07 : 0.11) + act * 0.35})`
        ctx.lineWidth = e.long ? 0.8 : 0.7
        ctx.beginPath()
        const [ax, ay] = toPx(A.x, A.y)
        const [bx, by] = toPx(B.x, B.y)
        if (e.long) {
          const [cx, cy] = toPx(e.cx, e.cy)
          ctx.moveTo(ax, ay)
          ctx.quadraticCurveTo(cx, cy, bx, by)
        } else {
          ctx.moveTo(ax, ay)
          ctx.lineTo(bx, by)
        }
        ctx.stroke()
      }

      for (const p of packets) {
        const e = edges[p.e]
        const A = nodes[e.a], B = nodes[e.b]
        const t = p.dir === 1 ? p.t : 1 - p.t
        const x = e.long ? bez(A.x, e.cx, B.x, t) : A.x + (B.x - A.x) * t
        const y = e.long ? bez(A.y, e.cy, B.y, t) : A.y + (B.y - A.y) * t
        const [px, py] = toPx(x, y)
        const g = ctx.createRadialGradient(px, py, 0, px, py, 7)
        g.addColorStop(0, `rgba(${CREAM},0.9)`)
        g.addColorStop(1, `rgba(${CREAM},0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(px, py, 7, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const n of nodes) {
        const [px, py] = toPx(n.x, n.y)
        if (n.cut) {
          // resection cavity: faint dashed ring with a cross
          ctx.strokeStyle = `rgba(${CREAM},0.35)`
          ctx.lineWidth = 1
          ctx.setLineDash([2, 3])
          ctx.beginPath()
          ctx.arc(px, py, 9, 0, Math.PI * 2)
          ctx.stroke()
          ctx.setLineDash([])
          ctx.beginPath()
          ctx.moveTo(px - 3, py - 3)
          ctx.lineTo(px + 3, py + 3)
          ctx.moveTo(px + 3, py - 3)
          ctx.lineTo(px - 3, py + 3)
          ctx.stroke()
          continue
        }
        const r = 1.4 + (n.deg / maxDeg) * 2.6 + n.act * 2.2
        if (n.act > 0.05) {
          const g = ctx.createRadialGradient(px, py, 0, px, py, r * 5)
          g.addColorStop(0, `rgba(${CREAM},${0.35 * n.act})`)
          g.addColorStop(1, `rgba(${CREAM},0)`)
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(px, py, r * 5, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = `rgba(${CREAM},${0.45 + 0.55 * n.act})`
        ctx.beginPath()
        ctx.arc(px, py, r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function step(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      // spontaneous activity, biased towards hubs
      spawnAcc += dt
      while (spawnAcc > 0.14) {
        spawnAcc -= 0.14
        const i = Math.floor(Math.random() * nodes.length)
        if (nodes[i].cut) continue
        if (Math.random() < 0.35 + 0.65 * (nodes[i].deg / maxDeg)) {
          nodes[i].act = Math.min(1, nodes[i].act + 0.6)
          emit(i)
        }
      }

      // pointer stimulation
      if (pointer.on) {
        nodes.forEach((n, i) => {
          if (n.cut) return
          const [px, py] = toPx(n.x, n.y)
          const d = Math.hypot(px - pointer.x, py - pointer.y)
          if (d < 70) {
            n.act = Math.min(1, n.act + dt * 3 * (1 - d / 70))
            if (Math.random() < dt * 2.5) emit(i)
          }
        })
      }

      for (let k = packets.length - 1; k >= 0; k--) {
        const p = packets[k]
        if (!live(edges[p.e])) {
          packets.splice(k, 1)
          continue
        }
        p.t += dt * p.speed
        if (p.t >= 1) {
          const e = edges[p.e]
          const to = p.dir === 1 ? e.b : e.a
          nodes[to].act = Math.min(1, nodes[to].act + 0.7)
          packets.splice(k, 1)
          if (Math.random() < 0.42) emit(to) // cascade
        }
      }
      for (const n of nodes) n.act *= Math.exp(-dt * 1.8)

      draw()
      if (visible) raf = requestAnimationFrame(step)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      cancelAnimationFrame(raf)
      if (visible && !reduced) {
        last = performance.now()
        raf = requestAnimationFrame(step)
      }
    })
    io.observe(canvas)

    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      pointer.x = e.clientX - r.left
      pointer.y = e.clientY - r.top
      pointer.on = true
    }
    const leave = () => (pointer.on = false)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerleave', leave)

    // virtual resection: click the nearest region to remove it
    const resect = (e: PointerEvent) => {
      if (!resectable) return
      const r = canvas.getBoundingClientRect()
      const x = e.clientX - r.left, y = e.clientY - r.top
      let best = -1, bd = 18
      nodes.forEach((n, i) => {
        if (n.cut) return
        const [px, py] = toPx(n.x, n.y)
        const d = Math.hypot(px - x, py - y)
        if (d < bd) { bd = d; best = i }
      })
      if (best < 0) return
      nodes[best].cut = true
      // neighbours react to the loss
      adj[best].forEach((k) => {
        const o = edges[k].a === best ? edges[k].b : edges[k].a
        nodes[o].act = 1
      })
      setCuts((c) => c + 1)
      if (reduced) draw()
    }
    canvas.addEventListener('pointerdown', resect)
    resetRef.current = () => {
      nodes.forEach((n) => (n.cut = false))
      setCuts(0)
      if (reduced) draw()
    }

    if (reduced) draw()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerleave', leave)
      canvas.removeEventListener('pointerdown', resect)
    }
  }, [count, resectable])

  return (
    <div className={`relative h-full w-full ${className}`}>
      <canvas
        ref={ref}
        className={`block h-full w-full touch-pan-y ${resectable ? 'cursor-crosshair' : ''}`}
        role="img"
        aria-label={
          'Animated brain network: regions seen from above, with pulses of information travelling along their connections' +
          (resectable ? '. Click a region to remove it in a virtual resection.' : '')
        }
      />
      {resectable && cuts > 0 && (
        <div className="absolute right-0 bottom-0 flex items-center gap-4 text-sm">
          <span className="text-cream/50">
            {cuts} {cuts === 1 ? 'region' : 'regions'} resected
          </span>
          <button
            type="button"
            onClick={() => resetRef.current()}
            className="cursor-pointer text-cream transition-opacity duration-300 hover:opacity-60"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  )
}
