/*
 * A thin, slowly scrolling neural recording trace (alpha-band oscillation with
 * occasional spikes), used as a section divider. Two identical tiles scroll like
 * the home page marquee, so the loop is seamless.
 */

const TILE = 1200
const MID = 20

function tracePath() {
  // deterministic sum of oscillations + a few spikes; starts and ends at the midline so tiles join
  const pts: string[] = []
  for (let x = 0; x <= TILE; x += 4) {
    const t = x / TILE
    const env = Math.sin(Math.PI * t) // fades to zero at the tile edges for a clean join
    let y =
      Math.sin(2 * Math.PI * 10 * t) * 5.5 + // alpha
      Math.sin(2 * Math.PI * 23 * t + 1.3) * 2.2 + // beta
      Math.sin(2 * Math.PI * 3 * t + 0.4) * 3 // slow drift
    for (const s of [0.18, 0.47, 0.81]) {
      const d = (t - s) * 140
      y -= 14 * Math.exp(-d * d) - 6 * Math.exp(-((d - 1.6) ** 2))
    }
    pts.push(`${x},${(MID - y * env).toFixed(2)}`)
  }
  return `M${pts.join(' L')}`
}

const D = tracePath()

export default function SignalTrace({ className = '' }: { className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <svg className="signal-trace block h-10 w-[200%]" viewBox={`0 0 ${TILE * 2} 40`} preserveAspectRatio="none">
        <path d={D} fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path d={D} transform={`translate(${TILE} 0)`} fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  )
}
