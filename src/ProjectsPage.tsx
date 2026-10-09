import { content as c } from './content'
import PageShell from './PageShell'
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

      {code && (
        <Section label="Code" index={1}>
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
