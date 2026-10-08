import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CvPage from './CvPage'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CvPage />
  </StrictMode>,
)
