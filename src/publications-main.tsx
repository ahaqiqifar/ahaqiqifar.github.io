import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Publications from './Publications'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Publications />
  </StrictMode>,
)
