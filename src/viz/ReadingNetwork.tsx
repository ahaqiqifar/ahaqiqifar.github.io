import { useRef } from 'react'
import { CREAM, FONT, glow, useCanvasLoop } from './useCanvasLoop'

/*
 * The left-hemisphere reading network, lateral view (front of the head on the left).
 * Each word appears, activity starts in primary visual cortex (V1), reaches the visual word form
 * area (VWFA) in ventral occipitotemporal cortex, then spreads along a dorsal route (angular gyrus,
 * superior temporal gyrus) and a ventral route to the inferior frontal gyrus (IFG).
 * Words cycle through Spanish, Basque and English, the languages of the BRIDGE project. Illustrative.
 */

// design box 400 x 290
const BRAIN = new Path2D(
  'M52 170 C34 112 76 52 156 40 C226 29 306 44 350 90 C379 120 388 156 372 186 C362 204 338 214 304 212 ' +
    'C284 232 244 246 204 240 C174 235 154 218 144 204 C124 214 84 216 64 200 C54 192 50 181 52 170 Z',
)
const SULCI = [
  new Path2D('M144 204 C172 178 212 163 262 158'), // lateral (Sylvian) fissure
  new Path2D('M210 42 C204 82 198 112 188 152'), // central sulcus
  new Path2D('M170 222 C200 214 236 210 278 204'), // superior temporal sulcus
  new Path2D('M300 64 C292 96 296 126 314 150'), // intraparietal / parieto-occipital hint
]
const CEREBELLUM = new Path2D('M286 214 C300 238 344 244 364 226 C376 214 372 196 360 192 C340 206 312 214 286 214 Z')
const STEM = new Path2D('M262 228 C266 246 268 262 266 284')

const NODES = {
  V1: { x: 362, y: 168, label: 'V1' },
  VWFA: { x: 296, y: 204, label: 'VWFA' },
  AG: { x: 292, y: 112, label: 'AG' },
  STG: { x: 236, y: 186, label: 'STG' },
  IFG: { x: 104, y: 160, label: 'IFG' },
}
type Id = keyof typeof NODES

// [from, to, start (s), duration (s), bow]
const WAVE: [Id, Id, number, number, number][] = [
  ['V1', 'VWFA', 0.15, 0.5, 0.15],
  ['VWFA', 'AG', 0.75, 0.55, -0.25],
  ['VWFA', 'STG', 0.75, 0.5, 0.1],
  ['VWFA', 'IFG', 0.8, 1.0, 0.22], // ventral route
  ['AG', 'IFG', 1.4, 0.75, -0.3], // dorsal route via the arcuate fasciculus
  ['STG', 'IFG', 1.35, 0.65, -0.2],
]
const CYCLE = 3.4

const WORDS = [
  ['Spanish', 'leer'],
  ['Basque', 'irakurri'],
  ['English', 'read'],
  ['Spanish', 'palabra'],
  ['Basque', 'hitza'],
  ['English', 'word'],
]

export default function ReadingNetwork({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const s = useRef({ t: 0 }).current

  useCanvasLoop(ref, (ctx, w, h, dt) => {
    s.t += dt
    const still = dt === 0 && s.t === 0
    // fill the box; the word goes in the empty corner under the frontal lobe
    const k = Math.min(w / 395, h / 292)
    const ox = (w - 400 * k) / 2, oy = (h - 290 * k) / 2
    const ct = still ? 1.6 : s.t % CYCLE
    const word = WORDS[Math.floor(s.t / CYCLE) % WORDS.length]

    ctx.clearRect(0, 0, w, h)

    // word + language
    const fade = Math.min(1, ct / 0.25, (CYCLE - ct) / 0.35)
    // word sits bottom-left, in the space under the frontal lobe
    ctx.font = `12px ${FONT}`
    ctx.fillStyle = `rgba(${CREAM},${0.45 * fade})`
    ctx.fillText(word[0], 4, h - 34)
    ctx.font = `24px ${FONT}`
    ctx.fillStyle = `rgba(${CREAM},${fade})`
    ctx.fillText(word[1], 4, h - 8)

    ctx.save()
    ctx.translate(ox, oy)
    ctx.scale(k, k)
    ctx.lineWidth = 1 / k
    ctx.strokeStyle = `rgba(${CREAM},0.22)`
    ctx.stroke(BRAIN)
    ctx.stroke(CEREBELLUM)
    ctx.stroke(STEM)
    ctx.strokeStyle = `rgba(${CREAM},0.1)`
    SULCI.forEach((p) => ctx.stroke(p))

    // activation of each node: decays after the wave reaches it
    const act: Record<Id, number> = { V1: 0, VWFA: 0, AG: 0, STG: 0, IFG: 0 }
    const hit = (id: Id, t0: number) => {
      if (ct >= t0) act[id] = Math.max(act[id], Math.exp(-(ct - t0) * 1.6))
    }
    hit('V1', 0)

    const ctrl = (a: Id, b: Id, bow: number) => {
      const A = NODES[a], B = NODES[b]
      const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2
      const dx = B.x - A.x, dy = B.y - A.y
      return { x: mx - dy * bow, y: my + dx * bow }
    }

    for (const [a, b, t0, dur, bow] of WAVE) {
      const A = NODES[a], B = NODES[b], c = ctrl(a, b, bow)
      ctx.strokeStyle = `rgba(${CREAM},0.14)`
      ctx.beginPath()
      ctx.moveTo(A.x, A.y)
      ctx.quadraticCurveTo(c.x, c.y, B.x, B.y)
      ctx.stroke()
      const p = (ct - t0) / dur
      if (p >= 0 && p <= 1) {
        // a short glowing pulse with a trail
        for (let q = 0; q < 6; q++) {
          const tt = Math.max(0, p - q * 0.03)
          const x = (1 - tt) ** 2 * A.x + 2 * (1 - tt) * tt * c.x + tt * tt * B.x
          const y = (1 - tt) ** 2 * A.y + 2 * (1 - tt) * tt * c.y + tt * tt * B.y
          ctx.fillStyle = `rgba(${CREAM},${0.9 - q * 0.14})`
          ctx.beginPath()
          ctx.arc(x, y, (2.6 - q * 0.3) , 0, Math.PI * 2)
          ctx.fill()
        }
      }
      hit(b, t0 + dur)
    }

    ctx.font = `11px ${FONT}`
    ctx.textAlign = 'center'
    for (const id of Object.keys(NODES) as Id[]) {
      const n = NODES[id]
      if (act[id] > 0.02) glow(ctx, n.x, n.y, 26, 0.45 * act[id])
      ctx.fillStyle = `rgba(${CREAM},${0.55 + 0.45 * act[id]})`
      ctx.beginPath()
      ctx.arc(n.x, n.y, 4 + act[id] * 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = `rgba(${CREAM},${0.5 + 0.5 * act[id]})`
      ctx.fillText(n.label, n.x, n.y - 13)
    }
    ctx.textAlign = 'left'
    ctx.restore()
  })

  return (
    <canvas
      ref={ref}
      className={`block h-full w-full ${className}`}
      role="img"
      aria-label="Illustration of the left-hemisphere reading network: activity flows from visual cortex to the visual word form area, then to temporal, parietal and frontal language regions"
    />
  )
}
