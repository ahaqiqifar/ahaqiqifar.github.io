import { StrictMode, type ComponentType } from 'react'
import { renderToString } from 'react-dom/server'
import { setSsrPath } from './links'
import App from './App'
import ResearchPage from './ResearchPage'
import ProjectsPage from './ProjectsPage'
import Publications from './Publications'
import CvPage from './CvPage'

// Build-time prerender: each page's HTML is written into dist/ so the text is there before
// JavaScript runs (for search engines, link previews and slow connections).
export const PAGES: Record<string, ComponentType> = {
  '/': App,
  '/research/': ResearchPage,
  '/projects/': ProjectsPage,
  '/publications/': Publications,
  '/cv/': CvPage,
}

export function render(path: string) {
  setSsrPath(path)
  const Page = PAGES[path]
  return renderToString(
    <StrictMode>
      <Page />
    </StrictMode>,
  )
}
