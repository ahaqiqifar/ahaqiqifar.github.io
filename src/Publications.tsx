import type { Publication } from './content'

type Props = { items: Publication[]; self?: string; scholarUrl?: string }

const pad = (n: number) => String(n).padStart(2, '0')

export default function Publications({ items, self, scholarUrl }: Props) {
  return (
    <section id="publications" className="scroll-mt-0 bg-[#141414] px-6 py-20 font-hn text-cream sm:px-10 sm:py-28">
      <div className="flex items-end justify-between gap-6 border-b border-cream/20 pb-6 sm:pb-8">
        <h2 className="m-0 text-5xl font-normal leading-none tracking-tight sm:text-7xl lg:text-8xl">Publications</h2>
        <span className="text-sm text-cream/50">({pad(items.length)})</span>
      </div>

      <ol className="m-0 list-none p-0">
        {items.map((p, i) => (
          <li
            key={p.url}
            className="grid gap-4 border-b border-cream/20 py-8 sm:grid-cols-[9rem_1fr_auto] sm:gap-10 sm:py-10"
          >
            <div className="flex gap-4 text-sm text-cream/50 sm:flex-col sm:gap-1">
              <span>{pad(i + 1)}</span>
              <span>{p.date}</span>
              <span>{p.kind}</span>
            </div>

            <div className="max-w-3xl">
              <h3 className="m-0 text-2xl font-normal leading-tight sm:text-3xl">
                <a href={p.url} target="_blank" rel="noreferrer" className="transition-opacity duration-300 hover:opacity-60">
                  {p.title}
                </a>
              </h3>
              <p className="mt-3 mb-0 text-sm leading-relaxed text-cream/50">
                {p.authors.map((a, k) => (
                  <span key={a}>
                    {k > 0 && ', '}
                    <span className={a === self ? 'text-cream' : undefined}>{a}</span>
                  </span>
                ))}
              </p>
              <p className="mt-1 mb-0 text-sm text-cream/50">{p.venue}</p>
              <p className="mt-4 mb-0 text-sm leading-relaxed text-cream/75 sm:text-base">{p.summary}</p>
            </div>

            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="self-start text-sm whitespace-nowrap transition-opacity duration-300 hover:opacity-60"
            >
              Read ↗
            </a>
          </li>
        ))}
      </ol>

      {scholarUrl && (
        <a
          href={scholarUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-10 inline-block text-sm transition-opacity duration-300 hover:opacity-60"
        >
          All publications on Google Scholar ↗
        </a>
      )}
    </section>
  )
}
