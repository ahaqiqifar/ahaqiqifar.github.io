"""Write the HTML entry file of every page (title, description, link-preview tags) from one template,
plus public/sitemap.xml. Run after adding a page or changing a title/description:

    python3 scripts/gen_pages.py
"""
import json
from pathlib import Path

SITE = 'https://ahaqiqifar.github.io'
NAME = 'Abolfazl HaqiqiFar'
ROOT = Path(__file__).resolve().parent.parent
FONT = 'https://db.onlinewebfonts.com/c/95cecf452d3208890088a5b4c19c7ecf?family=Helvetica+Neue+ME'

PAGES = [
    # path, entry script, <title>, description
    ('', 'main.tsx', 'Abolfazl — HaqiqiFar',
     f'{NAME}: computational neuroscientist and PhD candidate at BCBL, building whole-brain models and '
     'information-theoretic tools to study brain network dynamics.'),
    ('research/', 'research-main.tsx', f'Research — {NAME}',
     'Virtual brain twins, information dynamics, language and dyslexia, and signed and higher-order brain networks.'),
    ('projects/', 'projects-main.tsx', f'Projects — {NAME}',
     'Current research projects at BCBL and open-source code for brain network analysis and statistical physics.'),
    ('publications/', 'publications-main.tsx', f'Publications — {NAME}',
     f'Papers and preprints by {NAME} on information flow, structural balance and brain network dynamics.'),
    ('cv/', 'cv-main.tsx', f'CV — {NAME}',
     f'Curriculum vitae of {NAME}: education, fellowships, publications, projects, presentations and skills.'),
]

PERSON = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': NAME,
    'url': f'{SITE}/',
    'image': f'{SITE}/images/hero-bg.webp',
    'jobTitle': 'Predoctoral Researcher in Computational Neuroscience',
    'affiliation': {'@type': 'Organization', 'name': 'BCBL, Basque Center on Cognition, Brain and Language', 'url': 'https://www.bcbl.eu'},
    'alumniOf': [
        {'@type': 'CollegeOrUniversity', 'name': 'Shahid Beheshti University'},
        {'@type': 'CollegeOrUniversity', 'name': 'Bu-Ali Sina University'},
    ],
    'knowsAbout': ['Computational neuroscience', 'Network science', 'Whole-brain modelling', 'Transfer entropy', 'Statistical physics'],
    'sameAs': [
        'https://scholar.google.com/citations?user=XUYcSXgAAAAJ',
        'https://www.linkedin.com/in/abolfazl-haqiqifar/',
        'https://github.com/AbolfazlHaqiqiFar',
        'https://orcid.org/0009-0003-9705-4805',
        'https://www.bcbl.eu/en/abolfazl-haqiqifar',
    ],
}

TEMPLATE = """<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content="{desc}" />
    <meta name="author" content="{name}" />
    <meta name="theme-color" content="#141414" />
    <link rel="canonical" href="{url}" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <meta property="og:type" content="{og_type}" />
    <meta property="og:site_name" content="{name}" />
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{desc}" />
    <meta property="og:url" content="{url}" />
    <meta property="og:image" content="{site}/og.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{title}" />
    <meta name="twitter:description" content="{desc}" />
    <meta name="twitter:image" content="{site}/og.jpg" />
    <link rel="stylesheet" href="{font}" media="print" onload="this.media='all'" />{jsonld}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/{entry}"></script>
  </body>
</html>
"""

for path, entry, title, desc in PAGES:
    jsonld = ''
    if not path:
        jsonld = '\n    <script type="application/ld+json">' + json.dumps(PERSON, ensure_ascii=False) + '</script>'
    html = TEMPLATE.format(
        title=title, desc=desc, name=NAME, url=f'{SITE}/{path}', site=SITE, font=FONT,
        og_type='profile' if not path else 'website', entry=entry, jsonld=jsonld,
    )
    out = ROOT / path / 'index.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html)
    print('wrote', out.relative_to(ROOT))

urls = '\n'.join(f'  <url><loc>{SITE}/{p}</loc></url>' for p, *_ in PAGES)
(ROOT / 'public' / 'sitemap.xml').write_text(
    f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}\n</urlset>\n'
)
print('wrote public/sitemap.xml')
