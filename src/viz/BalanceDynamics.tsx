import { useRef } from 'react'
import { CREAM, FONT, rng, useCanvasLoop } from './useCanvasLoop'

/*
 * Structural balance in a signed network. Every edge is positive (solid) or negative (dashed).
 * A triangle is balanced when the product of its signs is positive. Constrained triad dynamics: pick
 * an unbalanced triangle and flip the edge that best reduces imbalance. Positive edges pull nodes together and
 * negative edges push them apart, so as balance is reached the network splits into two camps.
 * Energy U = -(1/#triads) * sum of triad sign products; fully balanced means U = -1.
 */

const N = 10
const PAIRS: [number, number][] = []
for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) PAIRS.push([i, j])
const TRIADS: [number, number, number][] = []
for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) for (let k = j + 1; k < N; k++) TRIADS.push([i, j, k])
const key = (a: number, b: number) => (a < b ? a * N + b : b * N + a)

export default function BalanceDynamics({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const sRef = useRef<ReturnType<typeof init> | null>(null)
  if (!sRef.current) sRef.current = init()
  const s = sRef.current

  function init() {
    const rand = rng(7)
    const sign = new Map<number, number>()
    PAIRS.forEach(([a, b]) => sign.set(key(a, b), rand() < 0.5 ? 1 : -1))
    const pos = Array.from({ length: N }, (_, i) => {
      const a = (2 * Math.PI * i) / N
      return { x: Math.cos(a) * 0.7, y: Math.sin(a) * 0.7, vx: 0, vy: 0 }
    })
    return { sign, pos, acc: 0, flash: null as [number, number, number] | null, flashT: 0, flipped: -1, hold: 0 }
  }

  const shake = (frac: number) => {
    PAIRS.forEach(([a, b]) => Math.random() < frac && s.sign.set(key(a, b), -s.sign.get(key(a, b))!))
  }

  useCanvasLoop(ref, (ctx, w, h, dt) => {
    const prod = (t: [number, number, number]) => s.sign.get(key(t[0], t[1]))! * s.sign.get(key(t[1], t[2]))! * s.sign.get(key(t[0], t[2]))!
    const unbalanced = TRIADS.filter((t) => prod(t) < 0)

    // Constrained triad dynamics (Antal, Krapivsky & Redner 2005): every 0.4 s pick an unbalanced
    // triad and flip the edge that most reduces the number of unbalanced triads (ties and, rarely,
    // uphill moves allowed so it can't get stuck). When balanced, hold, then perturb.
    s.acc += dt
    if (unbalanced.length === 0 && dt > 0) {
      s.hold += dt
      if (s.hold > 3.5) {
        shake(0.35)
        s.hold = 0
      }
    } else if (s.acc > 0.4 && unbalanced.length) {
      s.acc = 0
      const t = unbalanced[Math.floor(Math.random() * unbalanced.length)]
      let best = 0, bestD = Infinity
      for (const [a, b] of [[t[0], t[1]], [t[1], t[2]], [t[0], t[2]]]) {
        // flipping a-b turns its balanced triads unbalanced and vice versa
        let d = 0
        for (let c = 0; c < N; c++) if (c !== a && c !== b) d += prod([a, b, c]) > 0 ? 1 : -1
        if (d < bestD || (d === bestD && Math.random() < 0.5)) { bestD = d; best = key(a, b) }
      }
      if (bestD < 0 || (bestD === 0 && Math.random() < 0.5) || Math.random() < 0.05) {
        s.sign.set(best, -s.sign.get(best)!)
        s.flipped = best
      }
      s.flash = t
      s.flashT = 1
    }
    s.flashT = Math.max(0, s.flashT - dt * 2.2)

    // layout physics in unit coordinates
    if (dt > 0) {
      for (let it = 0; it < 2; it++) {
        const f = s.pos.map(() => ({ x: 0, y: 0 }))
        PAIRS.forEach(([a, b]) => {
          const A = s.pos[a], B = s.pos[b]
          const dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy) || 1e-3
          const sg = s.sign.get(key(a, b))!
          // positive: spring towards 0.6; negative: push apart until 1.7; everyone: avoid overlap
          let mag = sg > 0 ? 0.5 * (d - 0.6) : d < 1.7 ? 0.35 * (d - 1.7) : 0
          if (d < 0.38) mag -= 0.9 * (0.38 - d)
          f[a].x += (dx / d) * mag; f[a].y += (dy / d) * mag
          f[b].x -= (dx / d) * mag; f[b].y -= (dy / d) * mag
        })
        s.pos.forEach((p, i) => {
          f[i].x -= p.x * 0.1
          f[i].y -= p.y * 0.1
          p.vx = (p.vx + f[i].x * dt) * 0.9
          p.vy = (p.vy + f[i].y * dt) * 0.9
          p.x = Math.max(-0.95, Math.min(0.95, p.x + p.vx * dt * 2))
          p.y = Math.max(-0.95, Math.min(0.95, p.y + p.vy * dt * 2))
        })
      }
    }

    const top = 34
    const S = Math.min(w, h - top - 24) * 0.47
    const cx = w / 2, cy = top + (h - top - 24) / 2
    const P = (i: number) => ({ x: cx + s.pos[i].x * S, y: cy + s.pos[i].y * S })

    ctx.clearRect(0, 0, w, h)

    if (s.flash && s.flashT > 0) {
      const [a, b, c] = s.flash.map(P)
      ctx.fillStyle = `rgba(${CREAM},${0.14 * s.flashT})`
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.lineTo(c.x, c.y)
      ctx.closePath()
      ctx.fill()
    }

    PAIRS.forEach(([a, b]) => {
      const A = P(a), B = P(b)
      const pos = s.sign.get(key(a, b))! > 0
      const justFlipped = key(a, b) === s.flipped && s.flashT > 0
      ctx.setLineDash(pos ? [] : [3, 4])
      ctx.strokeStyle = `rgba(${CREAM},${justFlipped ? 0.9 : pos ? 0.42 : 0.2})`
      ctx.lineWidth = justFlipped ? 1.8 : 1
      ctx.beginPath()
      ctx.moveTo(A.x, A.y)
      ctx.lineTo(B.x, B.y)
      ctx.stroke()
    })
    ctx.setLineDash([])

    s.pos.forEach((_, i) => {
      const p = P(i)
      ctx.fillStyle = `rgba(${CREAM},1)`
      ctx.beginPath()
      ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2)
      ctx.fill()
    })

    const balanced = TRIADS.length - unbalanced.length
    const U = -TRIADS.reduce((sum, t) => sum + prod(t), 0) / TRIADS.length
    ctx.font = `12px ${FONT}`
    ctx.fillStyle = `rgba(${CREAM},0.5)`
    ctx.fillText(`balanced triads  ${balanced} / ${TRIADS.length}`, 8, 16)
    ctx.textAlign = 'right'
    ctx.fillText(`energy  ${U.toFixed(2)}`, w - 8, 16)
    ctx.textAlign = 'left'
    ctx.fillStyle = `rgba(${CREAM},0.35)`
    ctx.fillText(unbalanced.length ? 'resolving unbalanced triads…' : 'balanced: two camps', 8, h - 8)
    // legend
    ctx.textAlign = 'right'
    ctx.fillText('— positive   - - negative', w - 8, h - 8)
    ctx.textAlign = 'left'
  })

  return (
    <canvas
      ref={ref}
      onPointerDown={() => shake(0.4)}
      className={`block h-full w-full cursor-pointer ${className}`}
      role="img"
      aria-label="Signed network evolving towards structural balance and splitting into two groups. Click to perturb it."
    />
  )
}
