import { useEffect } from 'react'
import { content as c } from './content'
import { isCurrent, linkProps } from './links'
import MobileMenu from './MobileMenu'
import PublicationList from './PublicationList'

// Publications page: same header as the home page, on the dark drawer colour
export default function Publications() {
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
        <PublicationList heading="h1" animate />
      </main>
    </div>
  )
}
