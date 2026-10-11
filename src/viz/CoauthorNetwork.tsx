import { useRef, type PointerEvent } from 'react'
import { content as c } from '../content'
import { CREAM, FONT, glow, rng, useCanvasLoop } from './useCanvasLoop'

/*
 * Co-authorship network built from the publication list: one node per author (size = number of
 * papers), an edge between authors who share a paper (width = number of shared papers). The site
 * owner is pinned at the centre. A small force layout keeps it gently moving; hovering a person
 * shows their name and links.
 */

type N = { name: string; papers: number; x: number; y: number; vx: number; vy: number; self: boolean }
type E = { a: number; b: number; w: number }

function build() {
  const pubs = c.publications ?? []
  const names: string[] = []
  const papers = new Map<string, number>()
  const pair = new Map<string, number>()
  for (const p of pubs) {
    p.authors.forEach((a) => {
      if (!names.includes(a)) names.push(a)
      papers.set(a, (papers.get(a) ?? 0) + 1)
    })
    for (let i = 0; i < p.authors.length; i++)
      for (let j = i + 1; j < p.authors.length; j++) {
        const k = [p.authors[i], p.authors[j]].sort().join('|')
        pair.set(k, (pair.get(k) ?? 0) + 1)
      }
  }
  const rand = rng(11)
  const nodes: N[] = names.map((name, i) => {
    const a = (2 * Math.PI * i) / names.length
    const self = name === c.self
    return { name, papers: papers.get(name)!, x: self ? 0 : Math.cos(a) * 0.6 + (rand() - 0.5) * 0.1, y: self ? 0 : Math.sin(a) * 0.6, vx: 0, vy: 0, self }
  })
  const edges: E[] = [...pair].map(([k, w]) => {
    const [x, y] = k.split('|')
    return { a: names.indexOf(x), b: names.indexOf(y), w }
  })
  return { nodes, edges, papers: pubs.length }
}

export default function CoauthorNetwork({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const net = useRef<ReturnType<typeof build> | null>(null)
  if (!net.current) net.current = build()
  const s = useRef({ t: 0, hover: -1, S: 1, Sx: 1, cx: 0, cy: 0, pulse: [] as { e: number; t: number; dir: 1 | -1 }[], acc: 0 }).current
  const { nodes, edges } = net.current
  const maxP = Math.max(...nodes.map((n) => n.papers))

  const redraw = useCanvasLoop(ref, (ctx, w, h, dt) => {
    s.t += dt
    // force layout: springs on edges, repulsion between all, self pinned at the centre
    const steps = dt === 0 && s.t === 0 ? 300 : dt > 0 ? 1 : 0
    for (let it = 0; it < steps; it++) {
      const step = dt > 0 ? dt : 0.03
      nodes.forEach((n, i) => {
        if (n.self) return
        let fx = -n.x * 0.12, fy = -n.y * 0.12
        nodes.forEach((m, j) => {
          if (i === j) return
          const dx = n.x - m.x, dy = n.y - m.y, d2 = dx * dx + dy * dy + 1e-3
          fx += (dx / d2) * 0.07
          fy += (dy / d2) * 0.07
        })
        edges.forEach((e) => {
          if (e.a !== i && e.b !== i) return
          const m = nodes[e.a === i ? e.b : e.a]
          const dx = m.x - n.x, dy = m.y - n.y, d = Math.hypot(dx, dy) || 1e-3
          const f = 0.9 * (d - (m.self ? 0.8 : 0.5))
          fx += (dx / d) * f
          fy += (dy / d) * f
        })
        // a slow drift so the network breathes
        fx += Math.sin(s.t * 0.5 + i * 1.7) * 0.02
        fy += Math.cos(s.t * 0.4 + i * 2.3) * 0.02
        n.vx = (n.vx + fx * step) * 0.86
        n.vy = (n.vy + fy * step) * 0.86
        n.x = Math.max(-1, Math.min(1, n.x + n.vx * step * 3))
        n.y = Math.max(-1, Math.min(1, n.y + n.vy * step * 3))
      })
    }

    // occasional pulses along collaborations
    s.acc += dt
    if (s.acc > 0.5) {
      s.acc = 0
      const e = Math.floor(Math.random() * edges.length)
      s.pulse.push({ e, t: 0, dir: Math.random() < 0.5 ? 1 : -1 })
    }
    s.pulse = s.pulse.filter((p) => (p.t += dt * 0.7) < 1)

    s.S = Math.min(w * 0.4, h * 0.42)
    s.Sx = Math.min(w * 0.42, s.S * 1.35)
    s.cx = w / 2
    s.cy = h / 2
    const P = (n: N) => [s.cx + n.x * s.Sx, s.cy + n.y * s.S] as const
    const linked = (i: number) => s.hover < 0 || i === s.hover || edges.some((e) => (e.a === s.hover && e.b === i) || (e.b === s.hover && e.a === i))

    ctx.clearRect(0, 0, w, h)
    edges.forEach((e) => {
      const lit = s.hover < 0 || e.a === s.hover || e.b === s.hover
      const [x1, y1] = P(nodes[e.a]), [x2, y2] = P(nodes[e.b])
      ctx.strokeStyle = `rgba(${CREAM},${lit ? 0.14 + e.w * 0.12 : 0.04})`
      ctx.lineWidth = 0.6 + e.w * 0.9
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    })
    for (const p of s.pulse) {
      const e = edges[p.e]
      const [x1, y1] = P(nodes[e.a]), [x2, y2] = P(nodes[e.b])
      const t = p.dir === 1 ? p.t : 1 - p.t
      glow(ctx, x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, 6, 0.7)
    }

    ctx.font = `12px ${FONT}`
    ctx.textAlign = 'center'
    nodes.forEach((n, i) => {
      const [x, y] = P(n)
      const r = n.self ? 9 : 3.5 + (n.papers / maxP) * 5
      const on = linked(i)
      if (n.self) glow(ctx, x, y, 34, 0.25)
      ctx.fillStyle = `rgba(${CREAM},${on ? 1 : 0.25})`
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
      // labels: always for self, for hovered person and their co-authors, otherwise surname only
      const surname = n.name.split(' ').slice(-1)[0]
      const show = n.self || i === s.hover || (s.hover >= 0 && on)
      ctx.fillStyle = `rgba(${CREAM},${show ? 0.9 : on ? 0.45 : 0.15})`
      ctx.fillText(show ? n.name : surname, x, y - r - 7)
    })
    if (s.hover >= 0) {
      const n = nodes[s.hover]
      ctx.fillStyle = `rgba(${CREAM},0.5)`
      ctx.textAlign = 'left'
      ctx.fillText(`${n.name} · ${n.papers} ${n.papers === 1 ? 'paper' : 'papers'}`, 8, h - 10)
    }
    ctx.textAlign = 'left'
  })

  const pick = (e: PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - r.left, y = e.clientY - r.top
    let best = -1, bd = 22
    nodes.forEach((n, i) => {
      const d = Math.hypot(s.cx + n.x * s.Sx - x, s.cy + n.y * s.S - y)
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
      aria-label={`Co-author network: ${nodes.length} researchers across ${net.current.papers} papers`}
    />
  )
}

export const coauthorStats = () => {
  const pubs = c.publications ?? []
  const people = new Set(pubs.flatMap((p) => p.authors))
  people.delete(c.self ?? '')
  return { people: people.size, papers: pubs.length }
}
