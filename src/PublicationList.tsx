import { content as c } from './content'

const pad = (n: number) => String(n).padStart(2, '0')

type Props = {
  heading: 'h1' | 'h2'
  animate?: boolean // entrance animation, only useful when the list is visible on load
}

// Heading + numbered list of papers + Scholar link; used on the home page and /publications/
export default function PublicationList({ heading: Heading, animate = false }: Props) {
  const items = c.publications ?? []
  const anim = (ms: number) => (animate ? { className: 'anim-fade-up', style: { animationDelay: `${ms}ms` } } : { className: '', style: undefined })
  const Title = Heading === 'h1' ? 'h2' : 'h3'

  return (
    <>
      <div className={`${anim(100).className} flex items-end justify-between gap-6 border-b border-cream/20 pb-6 sm:pb-8`} style={anim(100).style}>
        <Heading className="m-0 text-5xl font-normal leading-none tracking-tight sm:text-7xl lg:text-8xl">Publications</Heading>
        <span className="text-sm text-cream/50">({pad(items.length)})</span>
      </div>

      <ol className="m-0 list-none p-0">
        {items.map((p, i) => (
          <li
            key={p.title}
            className={`${anim(250 + i * 120).className} grid gap-4 border-b border-cream/20 py-8 sm:grid-cols-[9rem_1fr_auto] sm:gap-10 sm:py-10`}
            style={anim(250 + i * 120).style}
          >
            <div className="flex gap-4 text-sm text-cream/50 sm:flex-col sm:gap-1">
              <span>{pad(i + 1)}</span>
              <span>{p.date}</span>
              <span>{p.kind}</span>
            </div>

            <div className="max-w-3xl">
              <Title className="m-0 text-2xl font-normal leading-tight sm:text-3xl">
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noreferrer" className="transition-opacity duration-300 hover:opacity-60">
                    {p.title}
                  </a>
                ) : (
                  p.title
                )}
              </Title>
              <p className="mt-3 mb-0 text-sm leading-relaxed text-cream/50">
                {p.authors.map((a, k) => (
                  <span key={a}>
                    {k > 0 && ', '}
                    <span className={a === c.self ? 'text-cream' : undefined}>{a}</span>
                  </span>
                ))}
              </p>
              <p className="mt-1 mb-0 text-sm text-cream/50">{p.venue}</p>
              <p className="mt-4 mb-0 text-sm leading-relaxed text-cream/75 sm:text-base">{p.summary}</p>
            </div>

            {p.url ? (
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="self-start text-sm whitespace-nowrap transition-opacity duration-300 hover:opacity-60"
              >
                Read ↗
              </a>
            ) : (
              <span className="self-start text-sm whitespace-nowrap text-cream/50">Forthcoming</span>
            )}
          </li>
        ))}
      </ol>

      {c.scholarUrl && (
        <a
          href={c.scholarUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-10 inline-block text-sm transition-opacity duration-300 hover:opacity-60"
        >
          All publications on Google Scholar ↗
        </a>
      )}
    </>
  )
}
