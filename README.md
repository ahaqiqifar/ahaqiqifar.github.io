# ahaqiqifar.github.io

Personal website of Abolfazl HaqiqiFar — computational neuroscience, network science and brain modelling.

Built with Vite, React, TypeScript and Tailwind CSS. Every push to `main` is built and published to GitHub Pages by `.github/workflows/deploy.yml`.

## Develop

```bash
npm install
npm run dev
```

## Where things live

- **Text, links, publications, CV, research themes, projects, repositories:** `src/content.ts` (open the site with `?v=reference` to see the original design it is based on)
- **Pages:** home `src/App.tsx`, `src/ResearchPage.tsx`, `src/ProjectsPage.tsx`, `src/Publications.tsx`, `src/CvPage.tsx`; inner pages share `src/PageShell.tsx` and `src/blocks.tsx`
- **Neuroscience visuals:** `src/BrainNetwork.tsx` (animated connectome with virtual resection), `src/SignalTrace.tsx` (scrolling neural signal), and in `src/viz/`: `ModelFit` (model fitted to MEG), `FlowChord` (directed flow between brain networks), `ReadingNetwork` (reading network), `BalanceDynamics` (structural balance), `IsingLattice` (interactive Ising model), `AxonTimeline` (career path as a firing neuron), `CoauthorNetwork` (built from the publication list), `TumourSpread` (standard vs anomalous diffusion), `TexasFlow` (directed weather network), `HigherOrder` (pairwise vs three-body spin spectra); shared canvas loop in `src/viz/useCanvasLoop.ts`
- **Page titles, descriptions and link previews:** edit `scripts/gen_pages.py`, then run `python3 scripts/gen_pages.py` (also rewrites `public/sitemap.xml`)
- **Hero photo:** `public/images/hero-bg.webp`; regenerate the cut-out with `python3 scripts/cutout.py`
- **Static extras:** `public/favicon.svg`, `public/og.jpg` (link preview), `public/404.html`, `public/robots.txt`
