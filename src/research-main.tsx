import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ResearchPage from './ResearchPage'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ResearchPage />
  </StrictMode>,
)
