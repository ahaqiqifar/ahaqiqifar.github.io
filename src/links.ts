export const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)'

const isExternal = (href: string) => href.startsWith('http')

export const linkProps = (href: string) =>
  isExternal(href) ? { href, target: '_blank', rel: 'noreferrer' } : { href }

// Is this nav link the page we're on? ('/publications/' matches '/publications/' and '/publications/index.html')
export const isCurrent = (href: string) =>
  href.startsWith('/') && href !== '/' && window.location.pathname.startsWith(href)
