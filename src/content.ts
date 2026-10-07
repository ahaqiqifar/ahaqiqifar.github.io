export type Link = { label: string; href: string }

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
export const abolfazl: Content = {
  title: 'Abolfazl — HaqiqiFar',
  brand: 'Abolfazl',
  year: '2026',
  nav: [
    { label: 'Research', href: '#' },
    { label: 'Projects', href: '#' },
    { label: 'Publications', href: '#' },
    { label: 'CV', href: '#' },
  ],
  social: [
    { label: 'GitHub', href: 'https://github.com/AbolfazlHaqiqiFar' },
    { label: 'Scholar', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ],
  marquee: ['Abolfazl', 'HaqiqiFar'],
  footerLeft: ['Neuroscience Researcher', 'Data Scientist', 'Obsessed by the Brain'],
  footerRight: ['Open to', 'Research Collaborations'],
  // hero-cutout.webp is generated from hero-bg.webp by scripts/cutout.py
  backgroundSrc: 'images/hero-bg.webp',
  portraitSrc: 'images/hero-cutout.webp',
}

export const content: Content =
  new URLSearchParams(window.location.search).get('v') === 'reference' ? reference : abolfazl
