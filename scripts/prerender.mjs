// Inject each page's server-rendered HTML into the built dist/<page>/index.html.
// Runs after `vite build` (client) and `vite build --ssr src/entry-server.tsx` (server bundle).
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const { render, PAGES } = await import(pathToFileURL(join(root, 'dist-ssr', 'entry-server.js')).href)

for (const path of Object.keys(PAGES)) {
  const file = join(root, 'dist', path, 'index.html')
  const html = readFileSync(file, 'utf8')
  if (!html.includes('<div id="root"></div>')) throw new Error(`no empty root in ${file}`)
  const body = render(path)
  writeFileSync(file, html.replace('<div id="root"></div>', `<div id="root">${body}</div>`))
  console.log(`prerendered ${path.padEnd(15)} ${(body.length / 1024).toFixed(1)} kB`)
}
rmSync(join(root, 'dist-ssr'), { recursive: true, force: true })
