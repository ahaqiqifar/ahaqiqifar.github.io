import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Served from the root of ahaqiqifar.github.io; one HTML entry per page
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        publications: resolve(import.meta.dirname, 'publications/index.html'),
        cv: resolve(import.meta.dirname, 'cv/index.html'),
        research: resolve(import.meta.dirname, 'research/index.html'),
        projects: resolve(import.meta.dirname, 'projects/index.html'),
      },
    },
  },
})
