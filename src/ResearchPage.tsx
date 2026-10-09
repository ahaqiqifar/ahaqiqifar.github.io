import { content as c } from './content'
import PageShell from './PageShell'
import BrainNetwork from './BrainNetwork'
import SignalTrace from './SignalTrace'
import { delay, ExtLink, pad, TitleRow } from './blocks'

export default function ResearchPage() {
  const r = c.research
  if (!r) return null

  return (
    <PageShell title="Research">
      <TitleRow title="Research" note="Brain networks · Information · Models" />

      <div className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div className="anim-fade-up" style={delay(200)}>
          <p className="m-0 text-2xl leading-snug sm:text-3xl">{r.intro}</p>
          <p className="mt-8 mb-0 max-w-md text-sm leading-relaxed text-cream/50">
            Brain regions seen from above, linked by their connections. Pulses show information passing between regions and
            spreading through the network. Move your cursor over it to stimulate a region.
          </p>
        </div>
        <div className="anim-fade-in mx-auto aspect-[1/1.08] w-full max-w-[560px]" style={delay(300)}>
          <BrainNetwork />
        </div>
      </div>

      <SignalTrace className="text-cream/30" />

      <ol className="m-0 list-none p-0">
        {r.themes.map((t, i) => (
          <li
            key={t.title}
            className="anim-fade-up grid gap-4 border-b border-cream/20 py-10 sm:grid-cols-[9rem_1fr] sm:gap-10 sm:py-14"
            style={delay(400 + i * 100)}
          >
            <span className="text-sm text-cream/50">{pad(i + 1)}</span>
            <div className="max-w-3xl">
              <h2 className="m-0 text-3xl font-normal leading-tight sm:text-4xl">{t.title}</h2>
              <p className="mt-4 mb-0 text-base leading-relaxed text-cream/80 sm:text-lg">{t.text}</p>
              <p className="mt-4 mb-0 text-sm text-cream/50">{t.methods}</p>
              {t.links.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  {t.links.map((l) => (
                    <ExtLink key={l.label} href={l.href}>
                      {l.label}
                    </ExtLink>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </PageShell>
  )
}
