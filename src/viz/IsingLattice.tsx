import { useRef, useState } from 'react'
import { useCanvasLoop } from './useCanvasLoop'

/*
 * 2D Ising model (J = 1, periodic boundaries) with Metropolis Monte Carlo, one checkerboard
 * sweep of the whole lattice per frame. Up spins are cream, down spins are background.
 * The temperature slider crosses the critical point T_c = 2 / ln(1 + sqrt 2) ≈ 2.269.
 * Dragging on the lattice paints up spins.
 */

const L = 100
const TC = 2 / Math.log(1 + Math.SQRT2)
const UP = [239, 238, 233]
const DOWN = [20, 20, 20]

export default function IsingLattice({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [T, setT] = useState(2.27)
  const [m, setM] = useState(0)
  const sRef = useRef<ReturnType<typeof make> | null>(null)
  if (!sRef.current) sRef.current = make()
  const s = sRef.current
  s.T = T

  function make() {
    const spins = new Int8Array(L * L).map(() => (Math.random() < 0.5 ? 1 : -1))
    const off = document.createElement('canvas')
    off.width = off.height = L
    const octx = off.getContext('2d')!
    return { spins, off, octx, img: octx.createImageData(L, L), T: 2.27, frames: 0, paint: null as null | { x: number; y: number } }
  }

  const sweep = () => {
    const { spins } = s
    const b = 1 / s.T
    const p4 = Math.exp(-4 * b), p8 = Math.exp(-8 * b)
    for (let parity = 0; parity < 2; parity++) {
      for (let y = 0; y < L; y++) {
        const up = ((y + L - 1) % L) * L, dn = ((y + 1) % L) * L, row = y * L
        for (let x = (y + parity) & 1; x < L; x += 2) {
          const i = row + x
          const nb = spins[row + ((x + 1) % L)] + spins[row + ((x + L - 1) % L)] + spins[up + x] + spins[dn + x]
          const dE = 2 * spins[i] * nb
          if (dE <= 0 || Math.random() < (dE === 4 ? p4 : p8)) spins[i] = -spins[i] as -1 | 1
        }
      }
    }
  }

  const redraw = useCanvasLoop(ref, (ctx, w, h, dt) => {
    if (dt > 0) sweep()
    if (s.paint) {
      const { x, y } = s.paint
      for (let dy = -3; dy <= 3; dy++)
        for (let dx = -3; dx <= 3; dx++)
          if (dx * dx + dy * dy <= 9) s.spins[((y + dy + L) % L) * L + ((x + dx + L) % L)] = 1
    }
    const d = s.img.data
    let sum = 0
    for (let i = 0; i < L * L; i++) {
      const c = s.spins[i] > 0 ? UP : DOWN
      sum += s.spins[i]
      d[i * 4] = c[0]; d[i * 4 + 1] = c[1]; d[i * 4 + 2] = c[2]; d[i * 4 + 3] = 255
    }
    s.octx.putImageData(s.img, 0, 0)
    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, w, h)
    ctx.drawImage(s.off, 0, 0, w, h)
    if (++s.frames % 10 === 0 || dt === 0) setM(Math.abs(sum) / (L * L))
  })

  const paintAt = (e: { clientX: number; clientY: number; currentTarget: HTMLCanvasElement }) => {
    const r = e.currentTarget.getBoundingClientRect()
    s.paint = { x: Math.floor(((e.clientX - r.left) / r.width) * L), y: Math.floor(((e.clientY - r.top) / r.height) * L) }
    redraw.current()
  }

  const reset = (ordered: boolean) => {
    s.spins.forEach((_, i) => (s.spins[i] = ordered ? 1 : Math.random() < 0.5 ? 1 : -1))
    redraw.current()
  }

  const phase = T < TC - 0.08 ? 'ordered: large domains' : T > TC + 0.08 ? 'disordered: random spins' : 'near critical: domains of every size'

  return (
    <div className={className}>
      <div className="aspect-square w-full border border-cream/20">
        <canvas
          ref={ref}
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); paintAt(e) }}
          onPointerMove={(e) => e.buttons && paintAt(e)}
          onPointerUp={() => (s.paint = null)}
          onPointerCancel={() => (s.paint = null)}
          className="block h-full w-full cursor-crosshair touch-none [image-rendering:pixelated]"
          role="img"
          aria-label={`Ising model simulation at temperature ${T.toFixed(2)}, ${phase}`}
        />
      </div>

      <div className="mt-5 grid gap-3 text-sm">
        <label className="flex items-center gap-4">
          <span className="w-24 shrink-0 text-cream/50">Temperature</span>
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={T}
            onChange={(e) => setT(Number(e.target.value))}
            className="w-full accent-[#efeee9]"
          />
          <span className="w-12 shrink-0 text-right tabular-nums">{T.toFixed(2)}</span>
        </label>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-cream/50">
          <span>
            {phase} · |m| = <span className="tabular-nums text-cream">{m.toFixed(2)}</span> · T<sub>c</sub> ≈ 2.27
          </span>
          <span className="flex gap-5">
            <button type="button" onClick={() => setT(TC)} className="cursor-pointer text-cream transition-opacity duration-300 hover:opacity-60">
              Go to T<sub>c</sub>
            </button>
            <button type="button" onClick={() => reset(false)} className="cursor-pointer text-cream transition-opacity duration-300 hover:opacity-60">
              Randomise
            </button>
            <button type="button" onClick={() => reset(true)} className="cursor-pointer text-cream transition-opacity duration-300 hover:opacity-60">
              Order
            </button>
          </span>
        </div>
      </div>
    </div>
  )
}
