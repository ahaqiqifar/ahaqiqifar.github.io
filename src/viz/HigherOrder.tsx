import { useRef, useState } from 'react'
import { CREAM, FONT, useCanvasLoop } from './useCanvasLoop'

/*
 * Two spin systems simulated side by side with Glauber (heat-bath) dynamics:
 *   pairwise:     E = -Σ J_ij s_i s_j
 *   higher-order: E = -Σ J_ij s_i s_j - Σ K_ijk s_i s_j s_k   (shaded triangles)
 * Each keeps a running estimate of its connected correlation matrix C_ij = <s_i s_j> - <s_i><s_j>,
 * whose eigenvalue spectrum is computed live (Jacobi method) and drawn as bars. The two spectra
 * differ: the kind of signature the project's classifier learns to detect. Real simulation,
 * illustrative parameters.
 */

const N = 8
const J = 0.32
const K = 0.9
const PAIRS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], [0, 4], [2, 6], [1, 5],
]
const TRIADS: [number, number, number][] = [
  [0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 0],
]
const ALPHA = 2e-5 // weight of each new sample in the running averages (~2 s of memory)

type Sim = { s: Int8Array; m: Float64Array; c: Float64Array; eig: number[] }

const newSim = (): Sim => ({
  s: Int8Array.from({ length: N }, () => (Math.random() < 0.5 ? 1 : -1)),
  m: new Float64Array(N),
  c: new Float64Array(N * N),
  eig: new Array(N).fill(0),
})

function sweep(sim: Sim, higher: boolean, updates: number) {
  const { s, m, c } = sim
  for (let u = 0; u < updates; u++) {
    const i = Math.floor(Math.random() * N)
    let h = 0
    for (const [a, b] of PAIRS) {
      if (a === i) h += J * s[b]
      else if (b === i) h += J * s[a]
    }
    if (higher)
      for (const t of TRIADS) {
        if (!t.includes(i)) continue
        const [x, y] = t.filter((v) => v !== i)
        h += K * s[x] * s[y]
      }
    s[i] = Math.random() < 1 / (1 + Math.exp(-2 * h)) ? 1 : -1
    // running averages of <s_i> and <s_i s_j>
    for (let a = 0; a < N; a++) {
      m[a] += ALPHA * (s[a] - m[a])
      for (let b = a; b < N; b++) {
        const v = c[a * N + b] + ALPHA * (s[a] * s[b] - c[a * N + b])
        c[a * N + b] = v
        c[b * N + a] = v
      }
    }
  }
}

// eigenvalues of a symmetric matrix by cyclic Jacobi rotations
function eigenvalues(A: number[][]) {
  const n = A.length
  const a = A.map((r) => r.slice())
  for (let sweepN = 0; sweepN < 30; sweepN++) {
    let off = 0
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += a[p][q] ** 2
    if (off < 1e-10) break
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(a[p][q]) < 1e-12) continue
        const theta = (a[q][q] - a[p][p]) / (2 * a[p][q])
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1))
        const cs = 1 / Math.sqrt(t * t + 1), sn = t * cs
        for (let k = 0; k < n; k++) {
          const akp = a[k][p], akq = a[k][q]
          a[k][p] = cs * akp - sn * akq
          a[k][q] = sn * akp + cs * akq
        }
        for (let k = 0; k < n; k++) {
          const apk = a[p][k], aqk = a[q][k]
          a[p][k] = cs * apk - sn * aqk
          a[q][k] = sn * apk + cs * aqk
        }
      }
  }
  return a.map((r, i) => r[i]).sort((x, y) => y - x)
}

const connected = (sim: Sim) =>
  Array.from({ length: N }, (_, i) => Array.from({ length: N }, (_, j) => sim.c[i * N + j] - sim.m[i] * sim.m[j]))

export default function HigherOrder({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [show, setShow] = useState<'pairwise' | 'higher'>('higher')
  const st = useRef({ pair: newSim(), high: newSim(), frame: 0, show: 'higher' as 'pairwise' | 'higher' }).current
  st.show = show

  const redraw = useCanvasLoop(ref, (ctx, w, h, dt) => {
    const updates = dt > 0 ? 400 : st.frame === 0 ? 150000 : 0 // first still frame: equilibrate
    sweep(st.pair, false, updates)
    sweep(st.high, true, updates)
    if (st.frame++ % 8 === 0 || dt === 0) {
      st.pair.eig = eigenvalues(connected(st.pair))
      st.high.eig = eigenvalues(connected(st.high))
    }

    ctx.clearRect(0, 0, w, h)
    const narrow = w < 640 // stacked layout unless the figure is very wide
    // layout: network on the left (top on narrow screens), spectrum on the right (bottom)
    const net = narrow ? { x: 0, y: 0, w, h: h * 0.56 } : { x: 0, y: 0, w: w * 0.5, h }
    const spec = narrow ? { x: 0, y: h * 0.58, w, h: h * 0.42 } : { x: w * 0.54, y: 0, w: w * 0.46, h }
    const sim = st.show === 'higher' ? st.high : st.pair

    // --- spin network ---
    const R = Math.min(net.w, net.h) * 0.36
    const cx = net.x + net.w / 2, cy = net.y + net.h / 2 + 6
    const P = (i: number) => {
      const a = -Math.PI / 2 + (2 * Math.PI * i) / N
      return [cx + R * Math.cos(a), cy + R * Math.sin(a)] as const
    }
    if (st.show === 'higher')
      for (const [a, b, c] of TRIADS) {
        const pa = P(a), pb = P(b), pc = P(c)
        const aligned = sim.s[a] * sim.s[b] * sim.s[c] > 0
        ctx.fillStyle = `rgba(${CREAM},${aligned ? 0.16 : 0.06})`
        ctx.beginPath()
        ctx.moveTo(pa[0], pa[1])
        ctx.lineTo(pb[0], pb[1])
        ctx.lineTo(pc[0], pc[1])
        ctx.closePath()
        ctx.fill()
      }
    ctx.strokeStyle = `rgba(${CREAM},0.3)`
    ctx.lineWidth = 1
    for (const [a, b] of PAIRS) {
      const pa = P(a), pb = P(b)
      ctx.beginPath()
      ctx.moveTo(pa[0], pa[1])
      ctx.lineTo(pb[0], pb[1])
      ctx.stroke()
    }
    for (let i = 0; i < N; i++) {
      const [x, y] = P(i)
      ctx.beginPath()
      ctx.arc(x, y, 7, 0, Math.PI * 2)
      if (sim.s[i] > 0) {
        ctx.fillStyle = `rgba(${CREAM},1)`
        ctx.fill()
      } else {
        ctx.fillStyle = '#141414'
        ctx.fill()
        ctx.strokeStyle = `rgba(${CREAM},0.7)`
        ctx.stroke()
      }
    }
    ctx.font = `12px ${FONT}`
    ctx.fillStyle = `rgba(${CREAM},0.5)`
    ctx.fillText(st.show === 'higher' ? 'pairwise + three-body' : 'pairwise only', net.x + 4, net.y + 14)

    // --- eigenvalue spectra: filled = shown system, outline = the other ---
    const top = spec.y + 26, bottom = spec.y + spec.h - 22
    const maxE = Math.max(0.05, ...st.pair.eig, ...st.high.eig)
    const bw = spec.w / N
    ctx.fillStyle = `rgba(${CREAM},0.5)`
    ctx.fillText('eigenvalue spectrum of correlations', spec.x, spec.y + 14)
    ctx.strokeStyle = `rgba(${CREAM},0.2)`
    ctx.beginPath()
    ctx.moveTo(spec.x, bottom)
    ctx.lineTo(spec.x + spec.w, bottom)
    ctx.stroke()
    const other = st.show === 'higher' ? st.pair : st.high
    for (let k = 0; k < N; k++) {
      const x = spec.x + k * bw + bw * 0.18
      const hv = (Math.max(0, sim.eig[k]) / maxE) * (bottom - top)
      const ho = (Math.max(0, other.eig[k]) / maxE) * (bottom - top)
      ctx.fillStyle = `rgba(${CREAM},0.85)`
      ctx.fillRect(x, bottom - hv, bw * 0.64, hv)
      ctx.strokeStyle = `rgba(${CREAM},0.45)`
      ctx.setLineDash([2, 2])
      ctx.strokeRect(x - 0.5, bottom - ho, bw * 0.64 + 1, ho)
      ctx.setLineDash([])
    }
    ctx.fillStyle = `rgba(${CREAM},0.35)`
    ctx.fillText('λ₁ … λ₈', spec.x, bottom + 15)
    ctx.textAlign = 'right'
    ctx.fillText(`- - ${st.show === 'higher' ? 'pairwise only' : 'with three-body'}`, spec.x + spec.w, bottom + 15)
    ctx.textAlign = 'left'
  })

  const choose = (v: 'pairwise' | 'higher') => {
    setShow(v)
    st.show = v
    redraw.current()
  }

  return (
    <div className={className}>
      <div className="aspect-[1/1.05] w-full">
        <canvas
          ref={ref}
          className="block h-full w-full"
          role="img"
          aria-label="Live simulation of spins with pairwise-only versus three-body interactions, with the eigenvalue spectra of their correlation matrices"
        />
      </div>
      <div className="mt-3 flex items-center justify-center gap-6 text-sm" role="group" aria-label="System shown">
        {(
          [
            ['pairwise', 'Pairwise only'],
            ['higher', 'With three-body'],
          ] as const
        ).map(([v, label]) => (
          <button
            key={v}
            type="button"
            aria-pressed={show === v}
            onClick={() => choose(v)}
            className={`cursor-pointer border-b pb-0.5 transition-opacity duration-300 ${show === v ? 'border-cream text-cream' : 'border-transparent text-cream/50 hover:text-cream'}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
