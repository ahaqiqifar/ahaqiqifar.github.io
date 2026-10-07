import { useEffect, useState, type CSSProperties } from 'react'
import { X } from 'lucide-react'
import { EASE, isCurrent, linkProps } from './links'
import type { Link } from './content'

type Props = {
  nav: Link[]
  social: Link[]
  // extra classes/style for the hamburger, e.g. the home page's entrance animation
  buttonClassName?: string
  buttonStyle?: CSSProperties
}

// Phone-only hamburger (morphs to X) and right slide-in drawer
export default function MobileMenu({ nav, social, buttonClassName = '', buttonStyle }: Props) {
  const [open, setOpen] = useState(false)

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
  const siteIndex = reveal(250, 'translate-y-4')
  const findMe = reveal(500, 'translate-y-4')

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`absolute right-4 top-[18px] z-50 flex h-10 w-10 items-center justify-center sm:hidden ${buttonClassName}`}
        style={buttonStyle}
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

      <div className="sm:hidden">
        <div
          onClick={() => setOpen(false)}
          className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        />
        <aside
          aria-hidden={!open}
          className={`fixed right-0 top-0 z-40 h-full w-[80%] max-w-sm bg-[#141414] px-8 py-10 font-hn text-cream transition-transform duration-[600ms] ${open ? 'translate-x-0' : 'translate-x-full'}`}
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
            <p className={`${siteIndex.className} m-0 text-xs uppercase tracking-[0.2em] text-cream/50`} style={siteIndex.style}>
              Site Index
            </p>
            <nav className="mt-6 flex flex-col gap-2">
              {nav.map((l, i) => {
                const r = reveal(300 + i * 80, 'translate-y-6')
                const current = isCurrent(l.href)
                return (
                  <a
                    key={l.label}
                    {...linkProps(l.href)}
                    aria-current={current ? 'page' : undefined}
                    tabIndex={open ? 0 : -1}
                    onClick={() => setOpen(false)}
                    className={`${r.className} text-4xl ${current ? 'text-cream/50' : 'text-cream'}`}
                    style={r.style}
                  >
                    {l.label}
                  </a>
                )
              })}
            </nav>
          </div>

          <div className="mt-14">
            <p className={`${findMe.className} m-0 text-xs uppercase tracking-[0.2em] text-cream/50`} style={findMe.style}>
              Find Me
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {social.map((l, i) => {
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
    </>
  )
}
