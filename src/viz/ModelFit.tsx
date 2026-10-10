import { useRef } from 'react'
import { CREAM, FONT, useCanvasLoop } from './useCanvasLoop'

/*
 * Fitting a brain model to a recording: a "recorded" MEG-like trace (fixed mixture of rhythms plus
 * noise) and a "simulated" trace whose parameters are nudged towards the recording each frame.
 * The correlation between the two is shown live; once the fit is good it holds, then restarts
 * from a fresh random guess. Illustrative only.
 */

type Params = { amp: number[]; freq: number[]; phase: number[] }

const TARGET: Params = { amp: [1, 0.55, 0.32], freq: [1.6, 3.7, 7.9], phase: [0.3, 1.9, 4.1] }
const N = 220

const randomGuess = (): Params => ({
  amp: TARGET.amp.map(() => 0.2 + Math.random() * 1.1),
  freq: TARGET.freq.map((f) => f * (0.6 + Math.random() * 0.8)),
  phase: TARGET.phase.map(() => Math.random() * Math.PI * 2),
})

const signal = (p: Params, x: number) => p.amp.reduce((s, a, i) => s + a * Math.sin(2 * Math.PI * p.freq[i] * x + p.phase[i]), 0)
// deterministic high-frequency "sensor noise" that scrolls with the trace
const noise = (x: number) => 0.16 * Math.sin(97 * x) + 0.1 * Math.sin(151 * x + 1.3) + 0.07 * Math.sin(233 * x + 0.4)

function correlation(a: number[], b: number[]) {
  const n = a.length
  const ma = a.reduce((s, v) => s + v, 0) / n, mb = b.reduce((s, v) => s + v, 0) / n
  let num = 0, da = 0, db = 0
  for (let i = 0; i < n; i++) {
    num += (a[i] - ma) * (b[i] - mb)
    da += (a[i] - ma) ** 2
    db += (b[i] - mb) ** 2
  }
  return num / Math.sqrt(da * db || 1)
}

export default function ModelFit({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const s = useRef({ model: randomGuess(), t: 0, iter: 0, hold: 0, r: 0 }).current

  useCanvasLoop(ref, (ctx, w, h, dt) => {
    s.t += dt * 0.06
    if (s.hold > 0) {
      s.hold -= dt
      if (s.hold <= 0) {
        s.model = randomGuess()
        s.iter = 0
      }
    } else if (dt > 0) {
      // gradient-free nudge towards the recording, a stand-in for parameter estimation
      const k = 1 - Math.exp(-dt * 0.9)
      const m = s.model
      m.amp = m.amp.map((a, i) => a + (TARGET.amp[i] - a) * k + (Math.random() - 0.5) * 0.01)
      m.freq = m.freq.map((f, i) => f + (TARGET.freq[i] - f) * k)
      m.phase = m.phase.map((p, i) => p + (TARGET.phase[i] - p) * k)
      s.iter += Math.round(dt * 120)
      if (s.r > 0.975) s.hold = 3
    }

    const rec: number[] = [], sim: number[] = []
    for (let i = 0; i < N; i++) {
      const x = i / (N - 1) + s.t
      rec.push(signal(TARGET, x) + noise(x))
      sim.push(signal(s.model, x))
    }
    s.r = correlation(rec, sim)

    ctx.clearRect(0, 0, w, h)
    // two bands, each with a label row above it; traces are clipped to their band
    const pad = 16, label = 22, bottom = 40
    const B = Math.max(30, (h - 2 * label - bottom) / 2)
    const band1 = label, band2 = label * 2 + B
    const amp = B / 2 / 2.4

    // faint grid
    ctx.strokeStyle = `rgba(${CREAM},0.06)`
    ctx.lineWidth = 1
    for (let gx = 0; gx <= 10; gx++) {
      const x = pad + ((w - 2 * pad) * gx) / 10
      ctx.beginPath()
      ctx.moveTo(x, band1)
      ctx.lineTo(x, band2 + B)
      ctx.stroke()
    }

    const trace = (vals: number[], top: number, alpha: number, dash: number[] = []) => {
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, top, w, B)
      ctx.clip()
      ctx.setLineDash(dash)
      ctx.strokeStyle = `rgba(${CREAM},${alpha})`
      ctx.lineWidth = 1.2
      ctx.beginPath()
      vals.forEach((v, i) => {
        const x = pad + ((w - 2 * pad) * i) / (N - 1)
        const y = top + B / 2 - v * amp
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
      })
      ctx.stroke()
      ctx.restore()
    }
    trace(rec, band1, 0.55)
    trace(rec, band2, 0.16, [2, 4]) // ghost of the recording under the model, so the match is visible
    trace(sim, band2, 0.95)

    ctx.font = `12px ${FONT}`
    ctx.fillStyle = `rgba(${CREAM},0.5)`
    ctx.textBaseline = 'alphabetic'
    ctx.fillText('MEG · recorded', pad, band1 - 7)
    ctx.fillText('Model · simulated', pad, band2 - 7)

    const fit = Math.max(0, s.r)
    ctx.fillStyle = `rgba(${CREAM},0.5)`
    ctx.fillText(s.hold > 0 ? 'fitted' : `iteration ${s.iter}`, pad, h - 12)
    ctx.textAlign = 'right'
    ctx.fillStyle = `rgba(${CREAM},${0.6 + 0.4 * fit})`
    ctx.font = `15px ${FONT}`
    ctx.fillText(`fit  r = ${fit.toFixed(2)}`, w - pad, h - 12)
    ctx.textAlign = 'left'

    // fit bar
    ctx.fillStyle = `rgba(${CREAM},0.12)`
    ctx.fillRect(pad, h - bottom + 10, w - 2 * pad, 2)
    ctx.fillStyle = `rgba(${CREAM},0.85)`
    ctx.fillRect(pad, h - bottom + 10, (w - 2 * pad) * fit, 2)
  })

  return (
    <canvas
      ref={ref}
      className={`block h-full w-full ${className}`}
      role="img"
      aria-label="Illustration of fitting a brain model: a simulated signal gradually matches a recorded MEG signal"
    />
  )
}
