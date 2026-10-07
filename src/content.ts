export type Link = { label: string; href: string }

export type Publication = {
  title: string
  authors: string[]
  venue: string
  kind: 'Journal article' | 'Preprint'
  date: string
  url: string
  summary: string
}

export type Content = {
  title: string
  brand: string
  year: string
  nav: Link[]
  social: Link[]
  marquee: [first: string, last: string]
  footerLeft: string[]
  footerRight: string[]
  backgroundSrc: string
  portraitSrc: string
  self?: string // highlighted in author lists
  scholarUrl?: string
  publications?: Publication[]
}

// The original design, kept verbatim as a reference (open the site with ?v=reference)
export const reference: Content = {
  title: 'Marcus — Bennet',
  brand: 'Marcus',
  year: '2025',
  nav: [
    { label: 'Story', href: '#' },
    { label: 'Jobs', href: '#' },
    { label: 'Message', href: '#' },
  ],
  social: [
    { label: 'Instagram', href: '#' },
    { label: 'TikTok', href: '#' },
    { label: 'YouTube', href: '#' },
  ],
  marquee: ['Marcus', 'Bennet'],
  footerLeft: ['Visuals Composer', 'Digital Crafter', 'Obsessed by The Office'],
  footerRight: ['A homage to', 'Marcus Holloway'],
  backgroundSrc:
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260729_022513_486985a2-ac8c-4278-91a8-071dcd9fcaff.png&w=1280&q=85',
  portraitSrc:
    'https://stone-expand-60400629.figma.site/_assets/v11/8da570354e86aa0d44ac3e4aa335a72c8e750d68.png',
}

// Abolfazl's version
const SCHOLAR = 'https://scholar.google.com/citations?user=XUYcSXgAAAAJ&hl=en'

export const abolfazl: Content = {
  title: 'Abolfazl — HaqiqiFar',
  brand: 'Abolfazl',
  year: '2026',
  nav: [
    { label: 'Research', href: '#' },
    { label: 'Projects', href: '#' },
    { label: 'Publications', href: '#publications' },
    { label: 'CV', href: '#' },
  ],
  social: [
    { label: 'GitHub', href: 'https://github.com/AbolfazlHaqiqiFar' },
    { label: 'Scholar', href: SCHOLAR },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/abolfazl-haqiqifar/' },
  ],
  marquee: ['Abolfazl', 'HaqiqiFar'],
  footerLeft: ['Neuroscience Researcher', 'Data Scientist', 'Obsessed by the Brain'],
  footerRight: ['Open to', 'Research Collaborations'],
  // hero-cutout.webp is generated from hero-bg.webp by scripts/cutout.py
  backgroundSrc: 'images/hero-bg.webp',
  portraitSrc: 'images/hero-cutout.webp',
  self: 'Abolfazl HaqiqiFar',
  scholarUrl: SCHOLAR,
  // newest first
  publications: [
    {
      title: 'Patterns of information flow in autism canonical brain network by transfer entropy approach',
      authors: ['Abolfazl HaqiqiFar', 'Mohammad Amin Safaei', 'G. Reza Jafari'],
      venue: 'Scientific Reports',
      kind: 'Journal article',
      date: 'Aug 2026',
      url: 'https://doi.org/10.1038/s41598-026-66002-5',
      summary: 'Directed information flow within canonical brain networks in autism, measured with transfer entropy.',
    },
    {
      title: 'A Symphony of Genres: Driving Information Dynamics in Functional Brain Networks',
      authors: ['Abolfazl HaqiqiFar', 'Azin Shirmohammadi', 'Amirhossein Yekta', 'G. Reza Jafari'],
      venue: 'bioRxiv',
      kind: 'Preprint',
      date: 'Apr 2026',
      url: 'https://doi.org/10.64898/2026.04.22.720162',
      summary:
        'Different music genres drive distinct patterns of neural communication: rhythmically complex styles engage hub regions, while ambient genres promote more dispersed connectivity.',
    },
    {
      title: 'Empirical evidence for structural balance theory in functional brain networks',
      authors: ['Majid Saberi', 'Abolfazl HaqiqiFar', 'AmirHussein Abdolalizadeh', 'Bratislav Misic', 'Ali Khatibi'],
      venue: 'Frontiers in Network Physiology',
      kind: 'Journal article',
      date: 'Jan 2026',
      url: 'https://doi.org/10.3389/fnetp.2025.1681597',
      summary:
        'Balanced triads in functional brain networks live longer and reach higher peak energy than imbalanced ones, supporting structural balance theory.',
    },
  ],
}

export const content: Content =
  new URLSearchParams(window.location.search).get('v') === 'reference' ? reference : abolfazl
