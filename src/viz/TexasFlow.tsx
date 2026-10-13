import { useRef, type PointerEvent } from 'react'
import { CREAM, FONT, glow, rng, useCanvasLoop } from './useCanvasLoop'

/*
 * Texas as a directed network of weather stations. Grid points inside the state are linked by
 * directed edges standing in for transfer entropy (how much one site's past tells you about
 * another's future), mostly downwind (west to east, Gulf moisture northwards). Pulses show
 * influence flowing; now and then an extreme event starts somewhere and cascades downstream.
 * Hover a location to see what it influences. Illustrative network, not the project's results.
 */

// approximate state border (lon, lat), clockwise from the panhandle's north-west corner
const BORDER: [number, number][] = [
  [-103.04, 36.5], [-100.0, 36.5], [-100.0, 34.56], [-99.2, 34.4], [-98.1, 34.1], [-97.0, 33.88], [-96.0, 33.85],
  [-95.3, 33.88], [-94.48, 33.64], [-94.04, 33.55], [-94.04, 32.0], [-93.8, 31.4], [-93.55, 31.0], [-93.6, 30.3],
  [-93.75, 29.9], [-93.84, 29.7], [-94.7, 29.35], [-95.6, 28.75], [-96.6, 28.3], [-97.2, 27.6], [-97.4, 26.8],
  [-97.15, 25.95], [-97.5, 25.9], [-98.5, 26.2], [-99.1, 26.5], [-99.5, 27.5], [-100.3, 28.2], [-100.6, 28.9],
  [-101.4, 29.77], [-102.4, 29.8], [-103.0, 29.0], [-103.25, 28.98], [-104.0, 29.3], [-104.7, 30.0], [-105.0, 30.6],
  [-106.0, 31.4], [-106.6, 31.8], [-106.62, 32.0], [-103.06, 32.0],
]
const LAT0 = 31
const KX = Math.cos((LAT0 * Math.PI) / 180)
const XY = BORDER.map(([lon, lat]) => [lon * KX, -lat] as [number, number])
const minX = Math.min(...XY.map((p) => p[0])), maxX = Math.max(...XY.map((p) => p[0]))
const minY = Math.min(...XY.map((p) => p[1])), maxY = Math.max(...XY.map((p) => p[1]))

function inPoly(x: number, y: number) {
  let c = false
  for (let i = 0, j = XY.length - 1; i < XY.length; j = i++) {
    const [xi, yi] = XY[i], [xj, yj] = XY[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

type Node = { x: number; y: number; act: number; out: number }
type Edge = { a: number; b: number; w: number }

function build() {
  const rand = rng(1981)
  const nodes: Node[] = []
  const step = 0.85
  for (let lat = 25.9; lat <= 36.5; lat += step)
    for (let lon = -106.6; lon <= -93.6; lon += step / KX) {
      const x = lon * KX + (rand() - 0.5) * 0.25, y = -lat + (rand() - 0.5) * 0.25
      if (inPoly(x, y)) nodes.push({ x, y, act: 0, out: 0 })
    }
  // prevailing flow: towards the east and a little north
  const wind = [0.94, -0.34]
  const edges: Edge[] = []
  nodes.forEach((n, i) => {
    nodes
      .map((m, j) => {
        const dx = m.x - n.x, dy = m.y - n.y, d = Math.hypot(dx, dy)
        return { j, d, align: (dx * wind[0] + dy * wind[1]) / (d || 1) }
      })
      .filter((o) => o.j !== i && o.d < 1.5 && o.align > 0.35)
      .sort((p, q) => q.align / q.d - p.align / p.d)
      .slice(0, 2)
      .forEach((o) => edges.push({ a: i, b: o.j, w: 0.3 + 0.7 * rand() }))
  })
  // a few long-range teleconnections, south-west to north-east
  for (let k = 0; k < 7; k++) {
    const a = Math.floor(rand() * nodes.length), b = Math.floor(rand() * nodes.length)
    if (nodes[b].x - nodes[a].x > 3 && nodes[a].y - nodes[b].y > -1) edges.push({ a, b, w: 0.35 })
  }
  edges.forEach((e) => (nodes[e.a].out += e.w))
  const outAdj = nodes.map((_, i) => edges.map((e, k) => (e.a === i ? k : -1)).filter((k) => k >= 0))
  return { nodes, edges, outAdj }
}

export default function TexasFlow({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const net = useRef<ReturnType<typeof build> | null>(null)
  if (!net.current) net.current = build()
  const { nodes, edges, outAdj } = net.current
  const maxOut = Math.max(...nodes.map((n) => n.out))
  const s = useRef({
    t: 0, acc: 0, eventAcc: 2.5, hover: -1, S: 1, ox: 0, oy: 0,
    packets: [] as { e: number; t: number; strong: boolean }[],
    event: null as null | { i: number; t: number },
  }).current

  const redraw = useCanvasLoop(ref, (ctx, w, h, dt) => {
    s.t += dt
    // background chatter: random pulses along edges, weighted by strength
    s.acc += dt
    while (s.acc > 0.06) {
      s.acc -= 0.06
      const e = Math.floor(Math.random() * edges.length)
      if (Math.random() < edges[e].w && s.packets.length < 90) s.packets.push({ e, t: 0, strong: false })
    }
    // extreme events every few seconds, starting in the west or south-west
    s.eventAcc += dt
    if (s.eventAcc > 4.5) {
      s.eventAcc = 0
      const west = nodes.map((n, i) => ({ i, x: n.x })).sort((a, b) => a.x - b.x).slice(0, Math.ceil(nodes.length * 0.35))
      const i = west[Math.floor(Math.random() * west.length)].i
      s.event = { i, t: 0 }
      nodes[i].act = 1
      outAdj[i].forEach((e) => s.packets.push({ e, t: 0, strong: true }))
    }
    if (s.event) s.event.t += dt
    for (let k = s.packets.length - 1; k >= 0; k--) {
      const p = s.packets[k]
      p.t += dt * (p.strong ? 1.1 : 0.8)
      if (p.t >= 1) {
        const to = edges[p.e].b
        s.packets.splice(k, 1)
        if (p.strong) {
          nodes[to].act = Math.min(1, nodes[to].act + 0.8)
          // the event keeps cascading downstream, weakening as it goes
          if (Math.random() < 0.72) outAdj[to].forEach((e) => s.packets.length < 160 && s.packets.push({ e, t: 0, strong: true }))
        } else nodes[to].act = Math.min(1, nodes[to].act + 0.12)
      }
    }
    nodes.forEach((n) => (n.act *= Math.exp(-dt * 1.4)))

    const pad = 10
    s.S = Math.min((w - 2 * pad) / (maxX - minX), (h - 30 - 2 * pad) / (maxY - minY))
    s.ox = (w - (maxX - minX) * s.S) / 2 - minX * s.S
    s.oy = pad + (h - 30 - 2 * pad - (maxY - minY) * s.S) / 2 - minY * s.S
    const P = (x: number, y: number) => [s.ox + x * s.S, s.oy + y * s.S] as const

    ctx.clearRect(0, 0, w, h)
    ctx.strokeStyle = `rgba(${CREAM},0.3)`
    ctx.lineWidth = 1
    ctx.beginPath()
    XY.forEach(([x, y], k) => {
      const [px, py] = P(x, y)
      k ? ctx.lineTo(px, py) : ctx.moveTo(px, py)
    })
    ctx.closePath()
    ctx.stroke()

    const hov = s.hover
    edges.forEach((e) => {
      const A = nodes[e.a], B = nodes[e.b]
      const lit = hov < 0 ? Math.max(A.act, B.act) : e.a === hov ? 1 : 0
      const [x1, y1] = P(A.x, A.y), [x2, y2] = P(B.x, B.y)
      ctx.strokeStyle = `rgba(${CREAM},${(hov >= 0 && e.a !== hov ? 0.03 : 0.08 + e.w * 0.08) + lit * 0.4})`
      ctx.lineWidth = 0.6 + e.w * 0.6
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
      if (hov >= 0 && e.a === hov) {
        // arrowhead
        const ang = Math.atan2(y2 - y1, x2 - x1)
        ctx.fillStyle = `rgba(${CREAM},0.9)`
        ctx.beginPath()
        ctx.moveTo(x2, y2)
        ctx.lineTo(x2 - 7 * Math.cos(ang - 0.4), y2 - 7 * Math.sin(ang - 0.4))
        ctx.lineTo(x2 - 7 * Math.cos(ang + 0.4), y2 - 7 * Math.sin(ang + 0.4))
        ctx.fill()
      }
    })
    for (const p of s.packets) {
      const e = edges[p.e], A = nodes[e.a], B = nodes[e.b]
      const [px, py] = P(A.x + (B.x - A.x) * p.t, A.y + (B.y - A.y) * p.t)
      if (p.strong) glow(ctx, px, py, 7, 0.9)
      else {
        ctx.fillStyle = `rgba(${CREAM},0.45)`
        ctx.beginPath()
        ctx.arc(px, py, 1.1, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    nodes.forEach((n, i) => {
      const [px, py] = P(n.x, n.y)
      if (n.act > 0.15) glow(ctx, px, py, 16, 0.4 * n.act)
      const r = 1.6 + (n.out / maxOut) * 2 + n.act * 1.5
      ctx.fillStyle = `rgba(${CREAM},${hov >= 0 && i !== hov ? 0.35 : 0.6 + 0.4 * n.act})`
      ctx.beginPath()
      ctx.arc(px, py, i === hov ? r + 2 : r, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.font = `12px ${FONT}`
    ctx.fillStyle = `rgba(${CREAM},0.5)`
    if (hov >= 0) ctx.fillText(`this location influences ${outAdj[hov].length} others`, 4, h - 8)
    else if (s.event && s.event.t < 2.5) ctx.fillText('extreme event spreading downstream…', 4, h - 8)
    else ctx.fillText('directed influence between locations', 4, h - 8)
    ctx.textAlign = 'right'
    ctx.fillStyle = `rgba(${CREAM},0.35)`
    ctx.fillText('W → E', w - 4, h - 8)
    ctx.textAlign = 'left'
  })

  const pick = (e: PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - r.left, y = e.clientY - r.top
    let best = -1, bd = 14
    nodes.forEach((n, i) => {
      const d = Math.hypot(s.ox + n.x * s.S - x, s.oy + n.y * s.S - y)
      if (d < bd) { bd = d; best = i }
    })
    if (best !== s.hover) {
      s.hover = best
      redraw.current()
    }
  }

  return (
    <canvas
      ref={ref}
      onPointerMove={pick}
      onPointerDown={pick}
      onPointerLeave={() => { s.hover = -1; redraw.current() }}
      className={`block h-full w-full ${className}`}
      role="img"
      aria-label="Illustration of Texas as a directed network of weather locations, with extreme events spreading downstream"
    />
  )
}
