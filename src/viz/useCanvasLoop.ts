import { useEffect, useRef, type RefObject } from 'react'

export type Frame = (ctx: CanvasRenderingContext2D, w: number, h: number, dt: number) => void

export const CREAM = '239,238,233'
export const FONT = "'Helvetica Neue ME', Helvetica, Arial, sans-serif"
export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/*
 * Sizes a canvas to its CSS box (HiDPI aware) and calls `frame` on every animation frame while the
 * canvas is on screen. With reduced motion it only draws still frames (dt = 0). Returns `redraw`,
 * for drawing a still frame after an interaction when the loop isn't running.
 */
export function useCanvasLoop(ref: RefObject<HTMLCanvasElement | null>, frame: Frame) {
  const frameRef = useRef(frame)
  frameRef.current = frame
  const redraw = useRef<() => void>(() => {})

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const reduced = reducedMotion()
    let w = 0, h = 0, raf = 0, running = false, last = performance.now()

    const still = () => w > 0 && frameRef.current(ctx, w, h, 0)
    redraw.current = () => !running && still()

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      const dpr = Math.min(devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      still()
    }
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      frameRef.current(ctx, w, h, dt)
      raf = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf)
      running = e.isIntersecting && !reduced
      if (running) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    })
    io.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [ref])

  return redraw
}

// Small deterministic PRNG so layouts look the same on every visit
export function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const glow = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, a: number) => {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, `rgba(${CREAM},${a})`)
  g.addColorStop(1, `rgba(${CREAM},0)`)
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}
