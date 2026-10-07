import { useEffect } from 'react'
import { content as c } from './content'
import { isCurrent, linkProps } from './links'
import MobileMenu from './MobileMenu'

const pad = (n: number) => String(n).padStart(2, '0')
const delay = (ms: number) => ({ animationDelay: `${ms}ms` })

// Publications page: same header as the home page, on the dark drawer colour
export default function Publications() {
  const items = c.publications ?? []

  useEffect(() => {
    document.title = `Publications — ${c.marquee.join(' ')}`
  }, [])

  return (
    <div className="relative min-h-[100dvh] bg-[#141414] font-hn text-cream">
      <header className="flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8">
        <a href="/" className="text-lg tracking-wide transition-opacity duration-300 hover:opacity-60">
          {c.brand}
        </a>
        <div className="hidden items-start gap-16 sm:flex lg:gap-24">
          <span className="text-sm">{c.year}</span>
          <nav className="flex flex-col gap-0.5 text-sm">
            {c.nav.map((l) => {
              const current = isCurrent(l.href)
              return (
                <a
                  key={l.label}
                  {...linkProps(l.href)}
                  aria-current={current ? 'page' : undefined}
                  className={`transition-opacity duration-300 hover:opacity-60 ${current ? 'opacity-50' : ''}`}
                >
                  {l.label}
                </a>
              )
            })}
          </nav>
          <div className="flex flex-col gap-0.5 text-sm">
            {c.social.map((l) => (
              <a key={l.label} {...linkProps(l.href)} className="transition-opacity duration-300 hover:opacity-60">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </header>

      <MobileMenu nav={c.nav} social={c.social} />

      <main className="px-6 pt-20 pb-20 sm:px-10 sm:pt-32 sm:pb-28">
        <div className="anim-fade-up flex items-end justify-between gap-6 border-b border-cream/20 pb-6 sm:pb-8" style={delay(100)}>
          <h1 className="m-0 text-5xl font-normal leading-none tracking-tight sm:text-7xl lg:text-8xl">Publications</h1>
          <span className="text-sm text-cream/50">({pad(items.length)})</span>
        </div>

        <ol className="m-0 list-none p-0">
          {items.map((p, i) => (
            <li
              key={p.url}
              className="anim-fade-up grid gap-4 border-b border-cream/20 py-8 sm:grid-cols-[9rem_1fr_auto] sm:gap-10 sm:py-10"
              style={delay(250 + i * 120)}
            >
              <div className="flex gap-4 text-sm text-cream/50 sm:flex-col sm:gap-1">
                <span>{pad(i + 1)}</span>
                <span>{p.date}</span>
                <span>{p.kind}</span>
              </div>

              <div className="max-w-3xl">
                <h2 className="m-0 text-2xl font-normal leading-tight sm:text-3xl">
                  <a href={p.url} target="_blank" rel="noreferrer" className="transition-opacity duration-300 hover:opacity-60">
                    {p.title}
                  </a>
                </h2>
                <p className="mt-3 mb-0 text-sm leading-relaxed text-cream/50">
                  {p.authors.map((a, k) => (
                    <span key={a}>
                      {k > 0 && ', '}
                      <span className={a === c.self ? 'text-cream' : undefined}>{a}</span>
                    </span>
                  ))}
                </p>
                <p className="mt-1 mb-0 text-sm text-cream/50">{p.venue}</p>
                <p className="mt-4 mb-0 text-sm leading-relaxed text-cream/75 sm:text-base">{p.summary}</p>
              </div>

              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="self-start text-sm whitespace-nowrap transition-opacity duration-300 hover:opacity-60"
              >
                Read ↗
              </a>
            </li>
          ))}
        </ol>

        {c.scholarUrl && (
          <a
            href={c.scholarUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-block text-sm transition-opacity duration-300 hover:opacity-60"
          >
            All publications on Google Scholar ↗
          </a>
        )}
      </main>
    </div>
  )
}
