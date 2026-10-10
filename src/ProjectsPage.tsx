import { content as c } from './content'
import PageShell from './PageShell'
import IsingLattice from './viz/IsingLattice'
import { delay, Entry, ExtLink, pad, Section, TitleRow } from './blocks'

export default function ProjectsPage() {
  const current = c.cv?.projects ?? []
  const code = c.code

  return (
    <PageShell title="Projects">
      <TitleRow title="Projects" note={`(${pad(current.length + (code?.repos.length ?? 0))})`} />

      {current.length > 0 && (
        <Section label="Current research" index={0}>
          {current.map((e) => (
            <Entry key={e.title} e={e} />
          ))}
        </Section>
      )}

      <Section label="Try it" index={1}>
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_1fr] lg:gap-14">
          <div>
            <h3 className="m-0 text-2xl font-normal leading-tight sm:text-3xl">The Ising model</h3>
            <p className="mt-4 mb-0 text-base leading-relaxed text-cream/80">
              A grid of magnetic spins, each pointing up or down, that prefer to align with their neighbours while heat shakes
              them at random. It is the simplest system with a phase transition, and the same mathematics behind inverse Ising
              models of brain activity.
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
        <Section label="Code" index={2}>
          <ol className="m-0 list-none space-y-8 p-0">
            {code.repos.map((r, i) => (
              <li key={r.name} className="anim-fade-up grid gap-2 sm:grid-cols-[1fr_auto] sm:gap-8" style={delay(400 + i * 50)}>
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
