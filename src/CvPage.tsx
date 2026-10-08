import type { ReactNode } from 'react'
import { content as c, type CvEntry } from './content'
import PageShell from './PageShell'

const delay = (ms: number) => ({ animationDelay: `${ms}ms` })

// One CV section: small label on the left, content on the right (stacked on phones)
function Section({ label, index, children }: { label: string; index: number; children: ReactNode }) {
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

function Entry({ e }: { e: CvEntry }) {
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

const Authors = ({ names }: { names: string[] }) => (
  <>
    {names.map((a, k) => (
      <span key={a}>
        {k > 0 && ', '}
        <span className={a === c.self ? 'text-cream' : undefined}>{a}</span>
      </span>
    ))}
  </>
)

export default function CvPage() {
  const cv = c.cv
  if (!cv) return null
  const pubs = c.publications ?? []
  let i = 0

  return (
    <PageShell title="CV">
      <div className="anim-fade-up flex flex-wrap items-end justify-between gap-6 border-b border-cream/20 pb-6 sm:pb-8" style={delay(100)}>
        <h1 className="m-0 text-5xl font-normal leading-none tracking-tight sm:text-7xl lg:text-8xl">CV</h1>
        <span className="text-sm text-cream/50">{cv.role}</span>
      </div>

      <Section label="Summary" index={i++}>
        <p className="m-0 text-xl leading-snug sm:text-2xl">{cv.summary}</p>
      </Section>

      <Section label="Education" index={i++}>
        {cv.education.map((e) => (
          <Entry key={e.title} e={e} />
        ))}
      </Section>

      <Section label="Research Interests" index={i++}>
        <ul className="m-0 list-none space-y-2 p-0">
          {cv.interests.map((t) => (
            <li key={t} className="text-xl leading-snug sm:text-2xl">{t}</li>
          ))}
        </ul>
      </Section>

      {pubs.length > 0 && (
        <Section label="Publications" index={i++}>
          <ol className="m-0 list-none space-y-6 p-0">
            {pubs.map((p) => (
              <li key={p.url}>
                <a href={p.url} target="_blank" rel="noreferrer" className="text-lg leading-snug transition-opacity duration-300 hover:opacity-60 sm:text-xl">
                  {p.title}
                </a>
                <p className="mt-1 mb-0 text-sm text-cream/50">
                  <Authors names={p.authors} />
                </p>
                <p className="mt-1 mb-0 text-sm text-cream/50">
                  {p.venue} · {p.date}
                </p>
              </li>
            ))}
          </ol>
          <a href="/publications/" className="mt-8 inline-block text-sm transition-opacity duration-300 hover:opacity-60">
            All publications →
          </a>
        </Section>
      )}

      <Section label="Projects" index={i++}>
        {cv.projects.map((e) => (
          <Entry key={e.title} e={e} />
        ))}
      </Section>

      <Section label="Presentations" index={i++}>
        <ol className="m-0 list-none space-y-6 p-0">
          {cv.presentations.map((p) => (
            <li key={p.title}>
              <p className="m-0 text-lg leading-snug sm:text-xl">{p.title}</p>
              <p className="mt-1 mb-0 text-sm text-cream/50">
                <Authors names={p.authors} />
              </p>
              <p className="mt-1 mb-0 text-sm text-cream/50">
                {p.venue} · {p.year}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section label="Skills" index={i++}>
        <dl className="m-0 grid gap-6 lg:grid-cols-2 lg:gap-x-12">
          {cv.skills.map((s) => (
            <div key={s.area}>
              <dt className="text-lg sm:text-xl">{s.area}</dt>
              <dd className="m-0 mt-2 text-sm leading-relaxed text-cream/75 sm:text-base">{s.items}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section label="References" index={i++}>
        <p className="m-0 text-lg sm:text-xl">Available on request.</p>
      </Section>
    </PageShell>
  )
}
