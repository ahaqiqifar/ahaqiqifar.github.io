import { useEffect } from 'react'
import { content as c } from './content'
import { linkProps } from './links'
import MobileMenu from './MobileMenu'
import PublicationList from './PublicationList'
import BrainNetwork from './BrainNetwork'
import SignalTrace from './SignalTrace'
import { ExtLink, pad } from './blocks'

const delay = (ms: number) => ({ animationDelay: `${ms}ms` })

// Home page: full-viewport photo hero, then a research preview and publications
export default function App() {
  useEffect(() => {
    document.title = c.title
  }, [])

  return (
    <>
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
          <a href="/" className="anim-fade-up font-hn text-lg tracking-wide" style={delay(800)}>
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

        <MobileMenu nav={c.nav} social={c.social} buttonClassName="anim-fade-up" buttonStyle={delay(900)} />

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
      </section>

      {c.research && (
        <section id="research" className="bg-[#141414] px-6 pt-20 font-hn text-cream sm:px-10 sm:pt-28">
          <div className="flex items-end justify-between gap-6 border-b border-cream/20 pb-6 sm:pb-8">
            <h2 className="m-0 text-5xl font-normal leading-none tracking-tight sm:text-7xl lg:text-8xl">Research</h2>
            <span className="text-sm text-cream/50">Brain networks · Information · Models</span>
          </div>
          <div className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            <div>
              <p className="m-0 text-2xl leading-snug sm:text-3xl">{c.research.intro}</p>
              <ol className="mt-10 mb-0 list-none border-t border-cream/20 p-0">
                {c.research.themes.map((t, i) => (
                  <li key={t.title} className="flex gap-6 border-b border-cream/20 py-4 text-lg sm:text-xl">
                    <span className="w-8 shrink-0 pt-1 text-sm text-cream/50">{pad(i + 1)}</span>
                    {t.title}
                  </li>
                ))}
              </ol>
              <ExtLink href="/research/" className="mt-8 inline-block text-sm">
                Explore the research
              </ExtLink>
            </div>
            <div className="mx-auto aspect-[1/1.08] w-full max-w-[560px]">
              <BrainNetwork />
            </div>
          </div>
          <SignalTrace className="text-cream/30" />
        </section>
      )}

      {c.publications && (
        <section id="publications" className="bg-[#141414] px-6 py-20 font-hn text-cream sm:px-10 sm:py-28">
          <PublicationList heading="h2" />
        </section>
      )}
    </>
  )
}
