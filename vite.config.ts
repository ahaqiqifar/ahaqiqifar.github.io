import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Relative base so the build works both at the domain root and under a sub-path on GitHub Pages
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
