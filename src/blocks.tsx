import type { ReactNode } from 'react'
import { content as c, type CvEntry } from './content'

export const delay = (ms: number) => ({ animationDelay: `${ms}ms` })
export const pad = (n: number) => String(n).padStart(2, '0')

// Big page title with a small note on the right, over a cream rule
export function TitleRow({ title, note }: { title: string; note?: ReactNode }) {
  return (
    <div className="anim-fade-up flex flex-wrap items-end justify-between gap-6 border-b border-cream/20 pb-6 sm:pb-8" style={delay(100)}>
      <h1 className="m-0 text-5xl font-normal leading-none tracking-tight sm:text-7xl lg:text-8xl">{title}</h1>
      {note && <span className="text-sm text-cream/50">{note}</span>}
    </div>
  )
}

// Small label on the left, content on the right (stacked on phones)
export function Section({ label, index = 0, children }: { label: ReactNode; index?: number; children: ReactNode }) {
  return (
    <section
      className="anim-fade-up grid gap-6 border-b border-cream/20 py-10 sm:grid-cols-[9rem_1fr] sm:gap-10 sm:py-14"
      style={delay(200 + index * 90)}
    >
      <h2 className="m-0 text-sm font-normal text-cream/50">{label}</h2>
      <div className="max-w-4xl">{children}</div>
    </section>
  )
}

export function Entry({ e }: { e: CvEntry }) {
  return (
    <div className="[&+&]:mt-10">
      <h3 className="m-0 text-2xl font-normal leading-tight sm:text-3xl">{e.title}</h3>
      <p className="mt-2 mb-0 text-sm text-cream/75 sm:text-base">{e.org}</p>
      <p className="mt-1 mb-0 text-sm text-cream/50">{[e.place, e.dates].filter(Boolean).join(' · ')}</p>
      {e.details.length > 0 && (
        <ul className="mt-4 mb-0 list-none space-y-2 p-0">
          {e.details.map((d) => (
            <li key={d} className="relative pl-5 text-sm leading-relaxed text-cream/75 sm:text-base">
              <span className="absolute left-0 text-cream/50">—</span>
              {d}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Author list with the site owner's name highlighted
export function Authors({ names }: { names: string[] }) {
  return (
    <>
      {names.map((a, k) => (
        <span key={a}>
          {k > 0 && ', '}
          <span className={a === c.self ? 'text-cream' : undefined}>{a}</span>
        </span>
      ))}
    </>
  )
}

export const ExtLink = ({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) => {
  const ext = href.startsWith('http')
  return (
    <a
      href={href}
      {...(ext ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={`transition-opacity duration-300 hover:opacity-60 ${className}`}
    >
      {children}
      {ext ? ' ↗' : ' →'}
    </a>
  )
}
