import { useRef, useState, type PointerEvent } from 'react'
import { CREAM, FONT, glow, useCanvasLoop } from './useCanvasLoop'

/*
 * Directed information flow between the seven canonical resting-state networks, drawn on a circle.
 * Dots travel from source to target; arc weight = strength of flow; node size = total outflow.
 * The two conditions illustrate the pattern reported in HaqiqiFar, Safaei & Jafari (Sci Rep 2026):
 * in controls the default-mode and visual networks are the main sources with more feedback, in autism
 * the frontoparietal and limbic networks become hubs and the backbone splits in two. Illustrative
 * weights, not the paper's data.
 */

const NETS = [
  { id: 'VIS', name: 'Visual' },
  { id: 'SMN', name: 'Somatomotor' },
  { id: 'DAN', name: 'Dorsal attention' },
  { id: 'SAL', name: 'Salience' },
  { id: 'LIM', name: 'Limbic' },
  { id: 'FPN', name: 'Frontoparietal' },
  { id: 'DMN', name: 'Default mode' },
]
const ix = (id: string) => NETS.findIndex((n) => n.id === id)

type Cond = 'control' | 'autism'
const FLOWS: Record<Cond, [string, string, number][]> = {
  control: [
    ['DMN', 'FPN', 0.85], ['DMN', 'SAL', 0.6], ['DMN', 'LIM', 0.5], ['DMN', 'VIS', 0.4],
    ['VIS', 'DAN', 0.8], ['VIS', 'SMN', 0.6], ['VIS', 'DMN', 0.5],
    ['FPN', 'DMN', 0.5], ['DAN', 'VIS', 0.4], ['SAL', 'DMN', 0.4], ['SMN', 'DAN', 0.3], ['LIM', 'DMN', 0.3],
  ],
  autism: [
    ['FPN', 'DAN', 0.85], ['FPN', 'SAL', 0.7], ['FPN', 'SMN', 0.5], ['SAL', 'SMN', 0.3], ['DAN', 'SMN', 0.35],
    ['LIM', 'DMN', 0.75], ['LIM', 'VIS', 0.5], ['DMN', 'VIS', 0.3],
  ],
}

const matrix = (c: Cond) => {
  const m = NETS.map(() => NETS.map(() => 0))
  FLOWS[c].forEach(([a, b, w]) => (m[ix(a)][ix(b)] = w))
  return m
}
const TARGET = { control: matrix('control'), autism: matrix('autism') }

export default function FlowChord({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [cond, setCond] = useState<Cond>('control')
  const s = useRef({ W: matrix('control'), t: 0, hover: -1, pts: [] as { x: number; y: number }[], cond: 'control' as Cond }).current
  s.cond = cond

  const redraw = useCanvasLoop(ref, (ctx, w, h, dt) => {
    s.t += dt
    const T = TARGET[s.cond]
    const k = dt === 0 ? 1 : 1 - Math.exp(-dt * 3)
    s.W = s.W.map((row, i) => row.map((v, j) => v + (T[i][j] - v) * k))

    const cx = w / 2, cy = h / 2 + 4
    const R = Math.min(w, h) * 0.34
    s.pts = NETS.map((_, i) => {
      const a = -Math.PI / 2 + (2 * Math.PI * i) / NETS.length
      return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) }
    })
    const out = s.W.map((row) => row.reduce((a, b) => a + b, 0))
    const inn = NETS.map((_, j) => s.W.reduce((a, row) => a + row[j], 0))
    const maxOut = Math.max(1, ...out)

    ctx.clearRect(0, 0, w, h)
    ctx.strokeStyle = `rgba(${CREAM},0.08)`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, Math.PI * 2)
    ctx.stroke()

    // arcs: bowed towards the centre, offset sideways so A->B and B->A don't overlap
    const curve = (i: number, j: number) => {
      const A = s.pts[i], B = s.pts[j]
      const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2
      const dx = B.x - A.x, dy = B.y - A.y, len = Math.hypot(dx, dy) || 1
      const nx = -dy / len, ny = dx / len
      return { A, B, c: { x: mx + (cx - mx) * 0.5 + nx * R * 0.12, y: my + (cy - my) * 0.5 + ny * R * 0.12 } }
    }
    const at = (p: ReturnType<typeof curve>, t: number) => ({
      x: (1 - t) ** 2 * p.A.x + 2 * (1 - t) * t * p.c.x + t * t * p.B.x,
      y: (1 - t) ** 2 * p.A.y + 2 * (1 - t) * t * p.c.y + t * t * p.B.y,
    })

    s.W.forEach((row, i) =>
      row.forEach((v, j) => {
        if (v < 0.02) return
        const p = curve(i, j)
        const lit = s.hover < 0 || s.hover === i || s.hover === j
        const a = (lit ? 0.12 + v * 0.45 : 0.04) * Math.min(1, v * 4)
        ctx.strokeStyle = `rgba(${CREAM},${a})`
        ctx.lineWidth = 0.6 + v * 3
        ctx.beginPath()
        ctx.moveTo(p.A.x, p.A.y)
        ctx.quadraticCurveTo(p.c.x, p.c.y, p.B.x, p.B.y)
        ctx.stroke()
        // packets: more and faster for stronger flow
        const n = Math.max(1, Math.round(v * 4))
        for (let q = 0; q < n; q++) {
          const tt = (s.t * (0.25 + v * 0.35) + q / n) % 1
          const d = at(p, tt)
          ctx.fillStyle = `rgba(${CREAM},${(lit ? 0.9 : 0.15) * Math.min(1, v * 3)})`
          ctx.beginPath()
          ctx.arc(d.x, d.y, 1.6 + v * 1.4, 0, Math.PI * 2)
          ctx.fill()
        }
      }),
    )

    ctx.font = `12px ${FONT}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    s.pts.forEach((p, i) => {
      const r = 4 + (out[i] / maxOut) * 9
      if (out[i] / maxOut > 0.7) glow(ctx, p.x, p.y, r * 3.2, 0.25)
      ctx.fillStyle = `rgba(${CREAM},${s.hover < 0 || s.hover === i ? 1 : 0.4})`
      ctx.beginPath()
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
      ctx.fill()
      const lx = cx + (p.x - cx) * 1.25, ly = cy + (p.y - cy) * 1.25
      ctx.fillStyle = `rgba(${CREAM},${s.hover === i ? 1 : 0.6})`
      ctx.fillText(NETS[i].id, lx, ly)
    })

    // centre readout
    ctx.fillStyle = `rgba(${CREAM},0.6)`
    if (s.hover >= 0) {
      ctx.font = `14px ${FONT}`
      ctx.fillText(NETS[s.hover].name, cx, cy - 10)
      ctx.font = `11px ${FONT}`
      ctx.fillStyle = `rgba(${CREAM},0.45)`
      ctx.fillText(`out ${out[s.hover].toFixed(1)} · in ${inn[s.hover].toFixed(1)}`, cx, cy + 10)
    } else {
      ctx.font = `11px ${FONT}`
      ctx.fillStyle = `rgba(${CREAM},0.35)`
      ctx.fillText('hover a network', cx, cy)
    }
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
  })

  const pick = (e: PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - r.left, y = e.clientY - r.top
    let best = -1, bd = 32
    s.pts.forEach((p, i) => {
      const d = Math.hypot(p.x - x, p.y - y)
      if (d < bd) { bd = d; best = i }
    })
    if (best !== s.hover) {
      s.hover = best
      redraw.current()
    }
  }

  const choose = (c: Cond) => {
    setCond(c)
    s.cond = c
    redraw.current()
  }

  return (
    <div className={className}>
      <div className="aspect-square w-full">
        <canvas
          ref={ref}
          onPointerMove={pick}
          onPointerDown={pick}
          onPointerLeave={() => { s.hover = -1; redraw.current() }}
          className="block h-full w-full"
          role="img"
          aria-label={`Illustration of directed information flow between seven brain networks, ${cond} pattern`}
        />
      </div>
      <div className="mt-3 flex items-center justify-center gap-6 text-sm" role="group" aria-label="Pattern">
        {(['control', 'autism'] as Cond[]).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cond === c}
            onClick={() => choose(c)}
            className={`cursor-pointer border-b pb-0.5 capitalize transition-opacity duration-300 hover:opacity-100 ${cond === c ? 'border-cream text-cream' : 'border-transparent text-cream/50'}`}
          >
            {c === 'control' ? 'Control' : 'Autism'}
          </button>
        ))}
      </div>
    </div>
  )
}
