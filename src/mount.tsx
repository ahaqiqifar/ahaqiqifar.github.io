import { StrictMode, type ComponentType } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

// Take over the prerendered HTML if there is any (production build), otherwise render from scratch (dev)
export function mount(Page: ComponentType) {
  const root = document.getElementById('root')!
  const app = (
    <StrictMode>
      <Page />
    </StrictMode>
  )
  if (root.hasChildNodes()) hydrateRoot(root, app)
  else createRoot(root).render(app)
}
