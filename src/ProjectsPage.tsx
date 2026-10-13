import type { ReactNode } from 'react'
import { content as c, type Project, type ProjectBlock } from './content'
import PageShell from './PageShell'
import BrainNetwork from './BrainNetwork'
import IsingLattice from './viz/IsingLattice'
import ReadingNetwork from './viz/ReadingNetwork'
import TumourSpread from './viz/TumourSpread'
import TexasFlow from './viz/TexasFlow'
import HigherOrder from './viz/HigherOrder'
import { delay, ExtLink, pad, Section, TitleRow } from './blocks'

// Interactive figure + caption for each project
const FIGURES: Record<Project['viz'], { figure: ReactNode; caption: string }> = {
  reading: {
    figure: (
      <div className="aspect-[4/3] w-full">
        <ReadingNetwork />
      </div>
    ),
    caption: 'Illustration: activity spreading through the left-hemisphere reading network as words are read in Spanish, Basque and English.',
  },
  twin: {
    figure: (
      <div className="aspect-[1/1.08] w-full">
        <BrainNetwork resectable nodes={130} />
      </div>
    ),
    caption: 'Virtual surgery, illustrated: click a region to remove it from the network and watch activity reroute through the remaining wiring.',
  },
  recurrence: {
    figure: <TumourSpread />,
    caption:
      'Illustration: tumour cells spreading from a resection site. Compare standard diffusion with anomalous diffusion, where cells make long jumps along white-matter tracts.',
  },
  weather: {
    figure: (
      <div className="aspect-[1/0.95] w-full">
        <TexasFlow />
      </div>
    ),
    caption: 'Illustration of a directed influence network across Texas, not the project’s results. Hover a location to see where its influence flows.',
  },
  'higher-order': {
    figure: <HigherOrder />,
    caption:
      'Live simulation: the same spins with pairwise couplings only, or with added three-body interactions (shaded triangles). Their correlation spectra differ (solid vs dashed), the kind of signature the classifier learns from.',
  },
}

// "Wiring. From diffusion MRI…" → emphasise the leading label
function Item({ text }: { text: string }) {
  const m = text.match(/^([A-Z][\w ]{2,24})\. (.*)$/)
  return m ? (
    <>
      <span className="text-cream">{m[1]}.</span> {m[2]}
    </>
  ) : (
    <>{text}</>
  )
}

function Block({ b }: { b: ProjectBlock }) {
  return (
    <div>
      {b.heading && <h3 className="m-0 mb-2 text-sm font-normal text-cream/50">{b.heading}</h3>}
      {b.text && <p className="m-0 text-base leading-relaxed text-cream/80 sm:text-lg">{b.text}</p>}
      {b.list && (
        <ol className={`m-0 list-none space-y-3 p-0 ${b.text ? 'mt-4' : ''}`}>
          {b.list.map((item, i) => (
            <li key={item} className="relative pl-8 text-base leading-relaxed text-cream/80">
              <span className="absolute left-0 text-sm leading-7 text-cream/50">{b.ordered ? pad(i + 1) : '—'}</span>
              <Item text={item} />
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default function ProjectsPage() {
  const projects = c.projects ?? []
  const code = c.code

  return (
    <PageShell title="Projects">
      <TitleRow title="Projects" note={`(${pad(projects.length)})`} />

      {/* index */}
      <ol className="anim-fade-up m-0 list-none border-b border-cream/20 p-0 py-6 sm:py-8" style={delay(150)}>
        {projects.map((p, i) => (
          <li key={p.id}>
            <a href={`#${p.id}`} className="flex gap-6 py-2 text-lg leading-snug transition-opacity duration-300 hover:opacity-60 sm:text-xl">
              <span className="w-8 shrink-0 pt-1 text-sm text-cream/50">{pad(i + 1)}</span>
              {p.title}
            </a>
          </li>
        ))}
      </ol>

      {projects.map((p, i) => {
        const fig = FIGURES[p.viz]
        return (
          <section
            key={p.id}
            id={p.id}
            className="anim-fade-up grid scroll-mt-6 gap-6 border-b border-cream/20 py-12 sm:grid-cols-[9rem_1fr] sm:gap-10 sm:py-16"
            style={delay(250 + i * 80)}
          >
            <span className="text-sm text-cream/50">{pad(i + 1)}</span>
            <div>
              <h2 className="m-0 max-w-4xl text-3xl font-normal leading-tight sm:text-4xl lg:text-5xl">{p.title}</h2>
              <p className="mt-5 mb-0 max-w-3xl text-xl leading-snug sm:text-2xl">{p.lead}</p>
              {p.meta.length > 0 && (
                <ul className="mt-5 mb-0 list-none space-y-1 p-0 text-sm text-cream/50">
                  {p.meta.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              )}

              <div className="mt-10 grid items-start gap-12 lg:grid-cols-[1fr_minmax(0,0.85fr)] lg:gap-14">
                <div className="max-w-2xl space-y-7">
                  {p.blocks.map((b, k) => (
                    <Block key={k} b={b} />
                  ))}
                  <p className="m-0 border-t border-cream/20 pt-5 text-sm leading-relaxed text-cream/50">{p.methods}</p>
                  {p.links && (
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      {p.links.map((l) => (
                        <ExtLink key={l.label} href={l.href}>
                          {l.label}
                        </ExtLink>
                      ))}
                    </div>
                  )}
                </div>
                <figure className="m-0 w-full max-w-[520px] justify-self-center lg:sticky lg:top-8">
                  {fig.figure}
                  <figcaption className="mt-3 text-xs leading-relaxed text-cream/45">{fig.caption}</figcaption>
                </figure>
              </div>
            </div>
          </section>
        )
      })}

      <Section label="Try it" index={projects.length}>
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_1fr] lg:gap-14">
          <div>
            <h3 className="m-0 text-2xl font-normal leading-tight sm:text-3xl">The Ising model</h3>
            <p className="mt-4 mb-0 text-base leading-relaxed text-cream/80">
              A grid of magnetic spins, each pointing up or down, that prefer to align with their neighbours while heat shakes
              them at random. It is the simplest system with a phase transition, and the starting point of the inverse Ising
              methods above.
            </p>
            <p className="mt-4 mb-0 text-sm leading-relaxed text-cream/50">
              Metropolis Monte Carlo on a 100 × 100 lattice, running live in your browser. Slide the temperature through the
              critical point to watch domains form and dissolve, or drag on the lattice to flip spins.
            </p>
            {code && (
              <ExtLink href={`${code.user}/IsingModelSimulation`} className="mt-6 inline-block text-sm">
                IsingModelSimulation on GitHub
              </ExtLink>
            )}
          </div>
          <IsingLattice className="w-full max-w-[520px] justify-self-center" />
        </div>
      </Section>

      {code && (
        <Section label="Code" index={projects.length + 1}>
          <ol className="m-0 list-none space-y-8 p-0">
            {code.repos.map((r) => (
              <li key={r.name} className="grid gap-2 sm:grid-cols-[1fr_auto] sm:gap-8">
                <div>
                  <a
                    href={`${code.user}/${r.name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-lg leading-snug break-words transition-opacity duration-300 hover:opacity-60 sm:text-xl"
                  >
                    {r.name.replace(/-/g, ' ')}
                  </a>
                  <p className="mt-1 mb-0 text-sm leading-relaxed text-cream/75 sm:text-base">{r.text}</p>
                </div>
                <span className="text-sm whitespace-nowrap text-cream/50">
                  {r.lang} · {r.year}
                </span>
              </li>
            ))}
          </ol>
          <ExtLink href={code.user} className="mt-10 inline-block text-sm">
            All repositories on GitHub
          </ExtLink>
        </Section>
      )}
    </PageShell>
  )
}
