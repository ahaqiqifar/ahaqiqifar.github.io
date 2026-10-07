import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { content as c } from './content'
import Publications from './Publications'

const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)'
const delay = (ms: number) => ({ animationDelay: `${ms}ms` })

const isExternal = (href: string) => href.startsWith('http')
const linkProps = (href: string) =>
  isExternal(href) ? { href, target: '_blank', rel: 'noreferrer' } : { href }

export default function App() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.title = c.title
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Drawer items reveal with a stagger when opening and hide together when closing
  const reveal = (ms: number, from: string) => ({
    className: `transition-all duration-500 ${open ? 'translate-y-0 opacity-100' : `${from} opacity-0`}`,
    style: { transitionDelay: open ? `${ms}ms` : '0ms', transitionTimingFunction: EASE },
  })

  return (
    <main>
    <section className="relative h-[100dvh] w-full overflow-hidden font-hn text-cream">
      {/* Background */}
      <img src={c.backgroundSrc} alt="" className="anim-fade-in absolute inset-0 h-full w-full object-cover" />

      {/* Marquee name */}
      <div className="anim-fade-up absolute inset-x-0 top-[16vh] z-10 overflow-hidden sm:top-[14vh]" style={delay(500)}>
        <div className="marquee flex w-max whitespace-nowrap pb-[0.22em] font-hn text-[16vh] leading-none text-cream sm:text-[26vh]">
          {[0, 1].map((i) => (
            <span key={i} className="pr-[6vw]" aria-hidden={i === 1 || undefined}>
              {c.marquee[0]} &mdash; {c.marquee[1]}&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Front portrait cutout, above the marquee */}
      <img
        src={c.portraitSrc}
        alt="Portrait"
        className="anim-rise-in pointer-events-none absolute inset-0 z-20 h-full w-full object-cover"
        style={delay(300)}
      />

      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8">
        <a href="#" className="anim-fade-up font-hn text-lg tracking-wide" style={delay(800)}>
          {c.brand}
        </a>
        <div className="hidden items-start gap-16 sm:flex lg:gap-24">
          <span className="anim-fade-up text-sm" style={delay(900)}>
            {c.year}
          </span>
          <nav className="flex flex-col gap-0.5 text-sm">
            {c.nav.map((l, i) => (
              <a key={l.label} {...linkProps(l.href)} className="anim-fade-up transition-opacity duration-300 hover:opacity-60" style={delay(1000 + i * 80)}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-0.5 text-sm">
            {c.social.map((l, i) => (
              <a key={l.label} {...linkProps(l.href)} className="anim-fade-up transition-opacity duration-300 hover:opacity-60" style={delay(1150 + i * 80)}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Hamburger, morphs to X */}
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="anim-fade-up absolute right-4 top-[18px] z-50 flex h-10 w-10 items-center justify-center sm:hidden"
        style={delay(900)}
      >
        <span className="relative block h-4 w-6">
          <span
            className="absolute left-0 top-0 h-0.5 w-6 bg-cream transition-transform duration-500"
            style={{ transitionTimingFunction: EASE, transform: open ? 'translateY(7px) rotate(45deg)' : 'none' }}
          />
          <span
            className={`absolute left-0 top-[7px] h-0.5 w-6 bg-cream transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100'}`}
          />
          <span
            className="absolute bottom-0 left-0 h-0.5 w-6 bg-cream transition-transform duration-500"
            style={{ transitionTimingFunction: EASE, transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none' }}
          />
        </span>
      </button>

      {/* Cream rule */}
      <div
        className="anim-line absolute inset-x-6 bottom-[5.5rem] z-10 h-0.5 bg-cream sm:inset-x-10 sm:bottom-28"
        style={delay(1200)}
      />

      {/* Footer */}
      <footer className="absolute inset-x-0 bottom-0 z-30 flex items-end justify-between px-6 pb-5 font-hn text-xs leading-relaxed sm:px-10 sm:pb-8 sm:text-sm">
        <div className="anim-fade-up" style={delay(1400)}>
          {c.footerLeft.map((line) => (
            <p key={line} className="m-0">{line}</p>
          ))}
        </div>
        <div className="anim-fade-up text-right" style={delay(1550)}>
          {c.footerRight.map((line) => (
            <p key={line} className="m-0">{line}</p>
          ))}
        </div>
      </footer>

      {/* Mobile drawer */}
      <div className="sm:hidden">
        <div
          onClick={() => setOpen(false)}
          className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        />
        <aside
          aria-hidden={!open}
          className={`fixed right-0 top-0 z-40 h-full w-[80%] max-w-sm bg-[#141414] px-8 py-10 transition-transform duration-[600ms] ${open ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ transitionTimingFunction: EASE }}
        >
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            className="absolute right-6 top-6 text-cream transition-all duration-500"
            style={{
              transform: open ? 'rotate(0deg)' : 'rotate(90deg)',
              opacity: open ? 1 : 0,
              transitionDelay: open ? '300ms' : '0ms',
              transitionTimingFunction: EASE,
            }}
          >
            <X size={26} strokeWidth={1.5} />
          </button>

          <div className="mt-16">
            <p className={`${reveal(250, 'translate-y-4').className} m-0 text-xs uppercase tracking-[0.2em] text-cream/50`} style={reveal(250, 'translate-y-4').style}>
              Site Index
            </p>
            <nav className="mt-6 flex flex-col gap-2">
              {c.nav.map((l, i) => {
                const r = reveal(300 + i * 80, 'translate-y-6')
                return (
                  <a key={l.label} {...linkProps(l.href)} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className={`${r.className} text-4xl text-cream`} style={r.style}>
                    {l.label}
                  </a>
                )
              })}
            </nav>
          </div>

          <div className="mt-14">
            <p className={`${reveal(500, 'translate-y-4').className} m-0 text-xs uppercase tracking-[0.2em] text-cream/50`} style={reveal(500, 'translate-y-4').style}>
              Find Me
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {c.social.map((l, i) => {
                const r = reveal(550 + i * 60, 'translate-y-4')
                return (
                  <a key={l.label} {...linkProps(l.href)} tabIndex={open ? 0 : -1} className={`${r.className} text-sm text-cream`} style={r.style}>
                    {l.label}
                  </a>
                )
              })}
            </div>
          </div>
        </aside>
      </div>
    </section>
      {c.publications && <Publications items={c.publications} self={c.self} scholarUrl={c.scholarUrl} />}
    </main>
  )
}
