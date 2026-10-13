import { useRef, useState } from 'react'
import { brainOutline, inside } from '../BrainNetwork'
import { CREAM, FONT, glow, useCanvasLoop } from './useCanvasLoop'

/*
 * Tumour cells spreading from a resection site, seen from above.
 * Standard diffusion: every cell takes small Gaussian steps, so the cloud stays compact.
 * Anomalous diffusion along white matter: cells near a fibre tract occasionally make a long,
 * heavy-tailed (Lévy) jump along it, seeding satellites far from the original site. This is the
 * idea the project tests with fractional diffusion. Illustrative; not a fitted model.
 * Scale: the brain is ~17 cm front to back, i.e. 2 units, so 1 unit ≈ 8.5 cm.
 */

type Mode = 'standard' | 'anomalous'
type Cell = { x: number; y: number; age: number }

const ORIGIN = { x: -0.42, y: -0.38 } // left frontal
const CM = 1 / 8.5
const MAX = 520

// white-matter tracts as polylines: corpus callosum arcs, long association bundles, a projection loop
const bez = (a: number[], c: number[], b: number[], n = 40) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n
    return [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]]
  })
const TRACTS = [
  bez([-0.55, -0.5], [0, -0.78], [0.55, -0.5]), // forceps minor (frontal callosal)
  bez([-0.5, 0.62], [0, 0.88], [0.5, 0.62]), // forceps major (occipital callosal)
  bez([-0.6, 0.02], [0, -0.12], [0.6, 0.02]), // callosal body
  bez([-0.45, -0.72], [-0.7, 0.05], [-0.4, 0.78]), // left fronto-occipital
  bez([0.45, -0.72], [0.7, 0.05], [0.4, 0.78]), // right fronto-occipital
  bez([-0.25, -0.6], [-0.38, 0.1], [-0.2, 0.7]), // left cingulum
  bez([0.25, -0.6], [0.38, 0.1], [0.2, 0.7]), // right cingulum
]
const TRACT_PTS = TRACTS.map((t) => t.map(([x, y]) => ({ x, y })))

const gauss = () => Math.sqrt(-2 * Math.log(Math.random() + 1e-9)) * Math.cos(2 * Math.PI * Math.random())

export default function TumourSpread({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<Mode>('anomalous')
  const s = useRef({ cells: [] as Cell[], t: 0, mode: 'anomalous' as Mode, spawn: 0, jumps: [] as { x1: number; y1: number; x2: number; y2: number; t: number }[] }).current
  s.mode = mode

  const reset = () => {
    s.cells = []
    s.jumps = []
    s.t = 0
  }

  const step = (dt: number) => {
    s.t += dt
    s.spawn += dt
    while (s.spawn > 0.03 && s.cells.length < MAX) {
      s.spawn -= 0.03
      s.cells.push({ x: ORIGIN.x + gauss() * 0.02, y: ORIGIN.y + gauss() * 0.02, age: 0 })
    }
    // Brownian step scaled with sqrt(dt): after 16 s the cloud's spread is ~1.5 cm
    const sigma = 0.03 * Math.sqrt(dt)
    for (const c of s.cells) {
      c.age += dt
      let nx = c.x + gauss() * sigma, ny = c.y + gauss() * sigma
      // occasional long jump along a nearby tract (about once every 12 s per cell near white matter)
      if (s.mode === 'anomalous' && Math.random() < dt * 0.08) {
        // nearest tract point within reach
        let best: { ti: number; pi: number; d: number } | null = null
        TRACT_PTS.forEach((tr, ti) =>
          tr.forEach((p, pi) => {
            const d = Math.hypot(p.x - c.x, p.y - c.y)
            if (d < 0.12 && (!best || d < best.d)) best = { ti, pi, d }
          }),
        )
        if (best) {
          const { ti, pi } = best as { ti: number; pi: number }
          const tr = TRACT_PTS[ti]
          // heavy-tailed jump length along the tract (Pareto, alpha = 1.4)
          const L = Math.min(tr.length - 1, Math.round(3 * Math.pow(Math.random() + 1e-6, -1 / 1.4)))
          const dir = Math.random() < 0.5 ? -1 : 1
          const to = tr[Math.max(0, Math.min(tr.length - 1, pi + dir * L))]
          s.jumps.push({ x1: c.x, y1: c.y, x2: to.x, y2: to.y, t: 0 })
          nx = to.x + gauss() * 0.01
          ny = to.y + gauss() * 0.01
        }
      }
      if (inside(nx, ny) || Math.hypot(nx - ORIGIN.x, ny - ORIGIN.y) < 0.06) {
        c.x = nx
        c.y = ny
      }
    }
    s.jumps = s.jumps.filter((j) => (j.t += dt) < 0.8)
    if (s.t > 16) reset()
  }

  const redraw = useCanvasLoop(ref, (ctx, w, h, dt) => {
    if (dt > 0) step(dt)
    else if (s.cells.length === 0) for (let i = 0; i < 300; i++) step(0.03) // still frame: show a developed state

    const S = Math.min(w / 1.75, (h - 24) / 2.1)
    const OX = w / 2, OY = (h - 24) / 2 + 4
    const P = (x: number, y: number) => [OX + x * S, OY + y * S] as const

    ctx.clearRect(0, 0, w, h)
    ctx.strokeStyle = `rgba(${CREAM},0.16)`
    ctx.lineWidth = 1
    for (const hemi of brainOutline()) {
      ctx.beginPath()
      hemi.forEach(([x, y], k) => {
        const [px, py] = P(x, y)
        k ? ctx.lineTo(px, py) : ctx.moveTo(px, py)
      })
      ctx.closePath()
      ctx.stroke()
    }
    // tracts
    ctx.strokeStyle = `rgba(${CREAM},${s.mode === 'anomalous' ? 0.16 : 0.07})`
    ctx.lineWidth = 2.2
    ctx.lineCap = 'round'
    for (const tr of TRACT_PTS) {
      ctx.beginPath()
      tr.forEach((p, k) => {
        const [px, py] = P(p.x, p.y)
        k ? ctx.lineTo(px, py) : ctx.moveTo(px, py)
      })
      ctx.stroke()
    }
    // resection cavity
    const [ox, oy] = P(ORIGIN.x, ORIGIN.y)
    ctx.setLineDash([3, 3])
    ctx.strokeStyle = `rgba(${CREAM},0.5)`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(ox, oy, 0.06 * S, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])
    // 3 cm ring
    ctx.strokeStyle = `rgba(${CREAM},0.12)`
    ctx.setLineDash([1, 4])
    ctx.beginPath()
    ctx.arc(ox, oy, 3 * CM * S, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    // jumps (brief streaks)
    for (const j of s.jumps) {
      const [x1, y1] = P(j.x1, j.y1), [x2, y2] = P(j.x2, j.y2)
      ctx.strokeStyle = `rgba(${CREAM},${0.5 * (1 - j.t / 0.8)})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
    // cells
    let far = 0
    for (const c of s.cells) {
      const d = Math.hypot(c.x - ORIGIN.x, c.y - ORIGIN.y)
      if (d > 3 * CM) far++
      const [px, py] = P(c.x, c.y)
      ctx.fillStyle = `rgba(${CREAM},${d > 3 * CM ? 0.95 : 0.55})`
      ctx.beginPath()
      ctx.arc(px, py, d > 3 * CM ? 1.8 : 1.3, 0, Math.PI * 2)
      ctx.fill()
    }
    glow(ctx, ox, oy, 0.12 * S, 0.25)

    ctx.font = `12px ${FONT}`
    // label above the cavity on a dark backing so cells don't hide it
    const label = 'resection site'
    const lw = ctx.measureText(label).width
    const ly = oy - 0.17 * S
    ctx.fillStyle = 'rgba(20,20,20,0.85)'
    ctx.fillRect(ox - lw / 2 - 4, ly - 12, lw + 8, 17)
    ctx.fillStyle = `rgba(${CREAM},0.75)`
    ctx.textAlign = 'center'
    ctx.fillText(label, ox, ly)
    ctx.textAlign = 'left'
    ctx.fillStyle = `rgba(${CREAM},0.5)`
    const pct = s.cells.length ? Math.round((100 * far) / s.cells.length) : 0
    ctx.fillText(`cells more than 3 cm away: ${pct}%`, 4, h - 6)
  })

  const choose = (m: Mode) => {
    setMode(m)
    s.mode = m
    reset()
    redraw.current()
  }

  return (
    <div className={className}>
      <div className="aspect-[1/1.05] w-full">
        <canvas
          ref={ref}
          className="block h-full w-full"
          role="img"
          aria-label={`Illustration of tumour cells spreading from a resection site by ${mode === 'standard' ? 'standard diffusion' : 'anomalous diffusion with long jumps along white-matter tracts'}`}
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm" role="group" aria-label="Spread model">
        {(
          [
            ['standard', 'Standard diffusion'],
            ['anomalous', 'Anomalous, along white matter'],
          ] as [Mode, string][]
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => choose(m)}
            className={`cursor-pointer border-b pb-0.5 transition-opacity duration-300 ${mode === m ? 'border-cream text-cream' : 'border-transparent text-cream/50 hover:text-cream'}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
