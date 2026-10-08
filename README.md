# ahaqiqifar.github.io

Personal website of Abolfazl HaqiqiFar — neuroscience, data science and machine learning.

Built with Vite, React, TypeScript and Tailwind CSS. Every push to `main` is built and published to GitHub Pages by `.github/workflows/deploy.yml`.

## Develop

```bash
npm install
npm run dev
```

- Pages: home (`index.html` → `src/App.tsx`) , publications (`publications/index.html` → `src/Publications.tsx`) and CV (`cv/index.html` → `src/CvPage.tsx`); inner pages share `src/PageShell.tsx`
- Page text, links, publications and CV content: `src/content.ts` (open the site with `?v=reference` to see the original design it is based on)
- Hero photo: `public/images/hero-bg.webp`; regenerate the cut-out with `python3 scripts/cutout.py`
