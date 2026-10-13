import { useRef, type CSSProperties } from 'react'
import { CREAM, FONT, glow, rng, useCanvasLoop } from './useCanvasLoop'

/*
 * A career path drawn as a neuron. Dendrites collect input, the soma charges and fires, and the
 * action potential jumps from one node of Ranvier to the next along a myelinated axon (saltatory
 * conduction). Each node is a station of the timeline; its label lights up as the spike passes.
 * Horizontal from the sm breakpoint up, vertical on phones. Node positions are read from the
 * labels' layout, so the drawing always lines up with the text.
 */

export type Station = { years: string; title: string; place: string }

const CYCLE = 6.2 // seconds per firing cycle
const FIRE = 1.5 // soma fires at this time
const HOP = 0.32 // seconds per internode jump

type Branch = { x1: number; y1: number; x2: number; y2: number; depth: number }

// dendritic tree in local coords: soma at (0,0), growing towards -a (away from the axon)
function dendrites(): Branch[] {
  const rand = rng(31)
  const out: Branch[] = []
  const grow = (x: number, y: number, ang: number, len: number, depth: number) => {
    const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len
    out.push({ x1: x, y1: y, x2, y2, depth })
    if (depth >= 3) return
    const n = depth === 0 ? 3 : 2
    for (let k = 0; k < n; k++) {
      const spread = depth === 0 ? (k - 1) * 0.75 : (k - 0.5) * 0.7
      grow(x2, y2, ang + spread + (rand() - 0.5) * 0.3, len * (0.62 + rand() * 0.15), depth + 1)
    }
  }
  for (const a of [Math.PI - 0.55, Math.PI, Math.PI + 0.55]) grow(0, 0, a + (rand() - 0.5) * 0.2, 0.42, 0)
  return out
}
const TREE = dendrites()
const TIPS = TREE.filter((b) => b.depth === 3)

export default function AxonTimeline({ stations }: { stations: Station[] }) {
  const wrap = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLCanvasElement>(null)
  const anchors = useRef<(HTMLElement | null)[]>([]) // [soma caption, ...stations]
  const s = useRef({ t: 0 }).current

  useCanvasLoop(ref, (ctx, w, h, dt) => {
    const canvas = ref.current, box = wrap.current
    if (!canvas || !box) return
    s.t += dt
    const ct = dt === 0 && s.t === 0 ? FIRE + HOP * 1.5 : s.t % CYCLE
    const horizontal = w > h

    // node positions along the axon, taken from where the labels sit
    const cr = canvas.getBoundingClientRect()
    const along = anchors.current.map((el) => {
      if (!el) return 0
      const r = el.getBoundingClientRect()
      return horizontal ? r.left + r.width / 2 - cr.left : r.top + Math.min(r.height / 2, 22) - cr.top
    })
    const mid = horizontal ? h * 0.55 : w / 2
    const P = (a: number, c: number) => (horizontal ? [a, mid + c] : [mid + c, a]) as [number, number]
    const soma = along[0]
    const nodes = along.slice(1)
    const end = horizontal ? w - 6 : h - 6
    // dendrite size: fits the space left of (or above) the soma
    const scale = horizontal ? Math.min(h * 0.55, 120, soma / 1.05) : Math.min(w * 0.55, 60, soma / 1.05)
    const somaR = horizontal ? 13 : 9

    ctx.clearRect(0, 0, w, h)

    // --- dendrites (rotated so they point away from the axon) ---
    const D = (x: number, y: number) => (horizontal ? P(soma + x * scale, y * scale) : P(soma + x * scale * 0.9, y * scale))
    ctx.lineCap = 'round'
    for (const b of TREE) {
      const [x1, y1] = horizontal ? D(b.x1, b.y1) : P(soma + b.x1 * scale * 0.8, b.y1 * scale * 0.9)
      const [x2, y2] = horizontal ? D(b.x2, b.y2) : P(soma + b.x2 * scale * 0.8, b.y2 * scale * 0.9)
      ctx.strokeStyle = `rgba(${CREAM},${0.5 - b.depth * 0.09})`
      ctx.lineWidth = 2.2 - b.depth * 0.45
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
    // synaptic input travelling from the tips to the soma before it fires
    if (ct < FIRE) {
      TIPS.forEach((b, i) => {
        const delay = (i % 5) * 0.18
        const p = Math.min(1, Math.max(0, (ct - delay) / 0.9))
        if (p <= 0 || p >= 1) return
        const lx = b.x2 * (1 - p), ly = b.y2 * (1 - p)
        const [x, y] = horizontal ? D(lx, ly) : P(soma + lx * scale * 0.8, ly * scale * 0.9)
        ctx.fillStyle = `rgba(${CREAM},0.85)`
        ctx.beginPath()
        ctx.arc(x, y, 1.8, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    // --- axon: thin core, myelin sheaths between nodes, terminal boutons ---
    const [ax0, ay0] = P(soma + somaR, 0)
    const [ax1, ay1] = P(end, 0)
    ctx.strokeStyle = `rgba(${CREAM},0.35)`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(ax0, ay0)
    ctx.lineTo(ax1, ay1)
    ctx.stroke()

    const segs: [number, number][] = []
    let prev = soma + somaR + 6
    for (const n of nodes) {
      segs.push([prev, n - 5])
      prev = n + 5
    }
    const sheath = horizontal ? 7 : 6
    ctx.fillStyle = `rgba(${CREAM},0.1)`
    ctx.strokeStyle = `rgba(${CREAM},0.28)`
    for (const [a0, a1] of segs) {
      if (a1 - a0 < 8) continue
      const [x0, y0] = P(a0, -sheath / 2)
      const len = a1 - a0
      ctx.beginPath()
      if (horizontal) ctx.roundRect(x0, y0, len, sheath, sheath / 2)
      else ctx.roundRect(x0, y0, sheath, len, sheath / 2)
      ctx.fill()
      ctx.stroke()
    }
    // terminal branches
    for (const off of [-1, 0, 1]) {
      const [tx, ty] = P(end, 0)
      const [bx, by] = P(end + 0, off * 10)
      const [cx, cy] = P(end - 14, 0)
      ctx.strokeStyle = `rgba(${CREAM},0.35)`
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.quadraticCurveTo(tx, ty, bx, by)
      ctx.stroke()
      ctx.fillStyle = `rgba(${CREAM},0.6)`
      ctx.beginPath()
      ctx.arc(bx, by, 2.2, 0, Math.PI * 2)
      ctx.fill()
    }

    // --- soma: charges, then fires ---
    const charge = ct < FIRE ? ct / FIRE : 0
    const fired = ct >= FIRE ? Math.exp(-(ct - FIRE) * 4) : 0
    const [sx, sy] = P(soma, 0)
    glow(ctx, sx, sy, somaR * 3.2, 0.12 + 0.3 * charge + 0.6 * fired)
    ctx.fillStyle = `rgba(${CREAM},${0.55 + 0.45 * Math.max(charge, fired)})`
    ctx.beginPath()
    ctx.arc(sx, sy, somaR, 0, Math.PI * 2)
    ctx.fill()

    // --- action potential hopping node to node ---
    const hopT = ct - FIRE
    nodes.forEach((n, i) => {
      const reach = (i + 1) * HOP
      const since = hopT - reach
      const [nx, ny] = P(n, 0)
      const lit = since >= 0 ? Math.exp(-since * 1.4) : 0
      if (lit > 0.02) {
        glow(ctx, nx, ny, 22, 0.55 * lit)
        // expanding ring at the node
        if (since < 0.6) {
          ctx.strokeStyle = `rgba(${CREAM},${0.6 * (1 - since / 0.6)})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(nx, ny, 5 + since * 30, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
      ctx.fillStyle = `rgba(${CREAM},${0.5 + 0.5 * lit})`
      ctx.beginPath()
      ctx.arc(nx, ny, 3.2 + lit * 1.5, 0, Math.PI * 2)
      ctx.fill()
      const el = anchors.current[i + 1]
      if (el) el.style.opacity = String(0.55 + 0.45 * Math.min(1, lit * 1.4))
    })
    // the jump itself: a bright arc over the sheath between the previous node and this one
    const k = Math.floor(hopT / HOP)
    if (hopT >= 0 && k < nodes.length) {
      const from = k === 0 ? soma : nodes[k - 1]
      const to = nodes[k]
      const p = (hopT - k * HOP) / HOP
      const a = from + (to - from) * p
      const lift = Math.sin(Math.PI * p) * (horizontal ? 10 : 8)
      const [px, py] = P(a, -lift)
      glow(ctx, px, py, 12, 0.9)
    }
    // terminal release after the last node
    const relT = hopT - (nodes.length + 1) * HOP
    if (relT > 0 && relT < 1) glow(ctx, ax1, ay1, 18, 0.6 * (1 - relT))

    ctx.font = `11px ${FONT}`
    ctx.fillStyle = `rgba(${CREAM},0.35)`
    if (horizontal) ctx.fillText('saltatory conduction →', soma + somaR + 12, mid - 16)
  })

  return (
    <div ref={wrap} className="relative grid grid-cols-[64px_1fr] sm:grid-cols-1 sm:grid-rows-[150px_auto]">
      <canvas
        ref={ref}
        className="row-span-2 block h-full w-full sm:row-span-1"
        role="img"
        aria-label="A neuron whose axon carries a spike through each step of the timeline below"
      />
      <ol
        className="m-0 grid list-none gap-8 p-0 pt-16 sm:grid-cols-[repeat(var(--cols),minmax(0,1fr))] sm:gap-4 sm:pt-0"
        style={{ '--cols': stations.length + 1 } as CSSProperties}
      >
        <li ref={(el) => { anchors.current[0] = el }} className="text-sm text-cream/40">
          <span className="block">Input → spike</span>
        </li>
        {stations.map((st, i) => (
          <li key={st.title} ref={(el) => { anchors.current[i + 1] = el }} className="sm:text-center" style={{ opacity: 0.55 }}>
            <span className="block text-sm text-cream/50">{st.years}</span>
            <span className="mt-1 block text-base leading-snug sm:text-lg">{st.title}</span>
            <span className="mt-1 block text-sm text-cream/50">{st.place}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
