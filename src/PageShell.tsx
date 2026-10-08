import { useEffect, type ReactNode } from 'react'
import { content as c } from './content'
import { isCurrent, linkProps } from './links'
import MobileMenu from './MobileMenu'

// Inner pages: the home page's header on the dark drawer colour, page content below
export default function PageShell({ title, children }: { title: string; children: ReactNode }) {
  useEffect(() => {
    document.title = `${title} — ${c.marquee.join(' ')}`
  }, [title])

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

      <main className="px-6 pt-20 pb-20 sm:px-10 sm:pt-32 sm:pb-28">{children}</main>
    </div>
  )
}
