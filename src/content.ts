export type Link = { label: string; href: string }

export type Publication = {
  title: string
  authors: string[]
  venue: string
  kind: 'Journal article' | 'Preprint'
  date: string
  url: string
  summary: string
}

export type CvEntry = {
  title: string
  org: string
  place?: string
  dates: string
  details: string[]
}

export type Cv = {
  role: string
  summary: string
  education: CvEntry[]
  interests: string[]
  projects: CvEntry[]
  presentations: { title: string; authors: string[]; venue: string; year: string }[]
  skills: { area: string; items: string }[]
}

export type Content = {
  title: string
  brand: string
  year: string
  nav: Link[]
  social: Link[]
  marquee: [first: string, last: string]
  footerLeft: string[]
  footerRight: string[]
  backgroundSrc: string
  portraitSrc: string
  self?: string // highlighted in author lists
  scholarUrl?: string
  publications?: Publication[]
  cv?: Cv
}

// The original design, kept verbatim as a reference (open the site with ?v=reference)
export const reference: Content = {
  title: 'Marcus — Bennet',
  brand: 'Marcus',
  year: '2025',
  nav: [
    { label: 'Story', href: '#' },
    { label: 'Jobs', href: '#' },
    { label: 'Message', href: '#' },
  ],
  social: [
    { label: 'Instagram', href: '#' },
    { label: 'TikTok', href: '#' },
    { label: 'YouTube', href: '#' },
  ],
  marquee: ['Marcus', 'Bennet'],
  footerLeft: ['Visuals Composer', 'Digital Crafter', 'Obsessed by The Office'],
  footerRight: ['A homage to', 'Marcus Holloway'],
  backgroundSrc:
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260729_022513_486985a2-ac8c-4278-91a8-071dcd9fcaff.png&w=1280&q=85',
  portraitSrc:
    'https://stone-expand-60400629.figma.site/_assets/v11/8da570354e86aa0d44ac3e4aa335a72c8e750d68.png',
}

// Abolfazl's version
const SCHOLAR = 'https://scholar.google.com/citations?user=XUYcSXgAAAAJ&hl=en'

export const abolfazl: Content = {
  title: 'Abolfazl — HaqiqiFar',
  brand: 'Abolfazl',
  year: '2026',
  nav: [
    { label: 'Research', href: '#' },
    { label: 'Projects', href: '#' },
    { label: 'Publications', href: '/publications/' },
    { label: 'CV', href: '/cv/' },
  ],
  social: [
    { label: 'GitHub', href: 'https://github.com/AbolfazlHaqiqiFar' },
    { label: 'Scholar', href: SCHOLAR },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/abolfazl-haqiqifar/' },
  ],
  marquee: ['Abolfazl', 'HaqiqiFar'],
  footerLeft: ['Neuroscience Researcher', 'Data Scientist', 'Obsessed by the Brain'],
  footerRight: ['Open to', 'Research Collaborations'],
  // hero-cutout.webp is generated from hero-bg.webp by scripts/cutout.py
  backgroundSrc: '/images/hero-bg.webp',
  portraitSrc: '/images/hero-cutout.webp',
  self: 'Abolfazl HaqiqiFar',
  scholarUrl: SCHOLAR,
  // newest first
  publications: [
    {
      title: 'Patterns of information flow in autism canonical brain network by transfer entropy approach',
      authors: ['Abolfazl HaqiqiFar', 'Mohammad Amin Safaei', 'G. Reza Jafari'],
      venue: 'Scientific Reports',
      kind: 'Journal article',
      date: 'Aug 2026',
      url: 'https://doi.org/10.1038/s41598-026-66002-5',
      summary: 'Directed information flow within canonical brain networks in autism, measured with transfer entropy.',
    },
    {
      title: 'A Symphony of Genres: Driving Information Dynamics in Functional Brain Networks',
      authors: ['Abolfazl HaqiqiFar', 'Azin Shirmohammadi', 'Amirhossein Yekta', 'G. Reza Jafari'],
      venue: 'bioRxiv',
      kind: 'Preprint',
      date: 'Apr 2026',
      url: 'https://doi.org/10.64898/2026.04.22.720162',
      summary:
        'Different music genres drive distinct patterns of neural communication: rhythmically complex styles engage hub regions, while ambient genres promote more dispersed connectivity.',
    },
    {
      title: 'Empirical evidence for structural balance theory in functional brain networks',
      authors: ['Majid Saberi', 'Abolfazl HaqiqiFar', 'AmirHussein Abdolalizadeh', 'Bratislav Misic', 'Ali Khatibi'],
      venue: 'Frontiers in Network Physiology',
      kind: 'Journal article',
      date: 'Jan 2026',
      url: 'https://doi.org/10.3389/fnetp.2025.1681597',
      summary:
        'Balanced triads in functional brain networks live longer and reach higher peak energy than imbalanced ones, supporting structural balance theory.',
    },
  ],
  cv: {
    role: 'PhD Candidate in Computational Neuroscience',
    summary:
      'Computational neuroscientist and PhD candidate at the Basque Center on Cognition, Brain and Language (BCBL), trained in statistical physics and network science. Develops whole-brain models (virtual brain twins) and information-theoretic methods to study how brain network dynamics support function in health and disease, from glioma to bilingualism and dyslexia. Published work on directed information flow and structural balance in functional brain networks.',
    education: [
      {
        title: 'PhD Candidate',
        org: 'BCBL, Basque Center on Cognition, Brain and Language',
        place: 'San Sebastián, Spain',
        dates: 'Jul 2026 – Present',
        details: ['Advisors: Dr. Lucia Amoruso and Dr. Manuel Carreiras', 'Research area: Brain Network Modelling'],
      },
      {
        title: 'MSc in Statistical Physics and Complex Systems',
        org: 'Department of Physics, Shahid Beheshti University',
        place: 'Tehran, Iran',
        dates: 'Sep 2023 – Dec 2025',
        details: ['Advisor: Dr. Reza Jafari', 'Research area: Network Science'],
      },
      {
        title: 'BSc in Physics',
        org: 'Department of Physics, Bu-Ali Sina University',
        place: 'Hamedan, Iran',
        dates: '2018 – 2022',
        details: ['Advisor: Dr. Farhad H. Jafarpour', 'Research area: Biophysics'],
      },
      {
        title: 'Spring College in the Physics of Complex Systems',
        org: 'ICTP–SISSA',
        place: 'Trieste, Italy',
        dates: '2022',
        details: [],
      },
    ],
    interests: [
      'Whole-Brain Modelling & Virtual Brain Twins',
      'Information Dynamics in Brain Networks',
      'Brain Network Mechanisms of Language, Bilingualism & Dyslexia',
    ],
    projects: [
      {
        title: 'BRIDGE: Bridging the Gap — Bilingualism and Dyslexia',
        org: 'PhD Thesis Project, BCBL',
        dates: '2026 – Present',
        details: [
          'Studying how bilingual experience and orthographic transparency (Spanish–Basque vs. Spanish–English) shape the reading network of typical and dyslexic readers aged 9–13, using multimodal MRI and MEG',
          'Planned analyses: graph-theoretic metrics, transfer entropy, and computational models of the visual word form area',
        ],
      },
      {
        title: 'Virtual Brain Twins for Glioma Patients: Connectome-Based Modelling Fitted to MEG',
        org: 'PhD Project, BCBL',
        dates: '2026 – Present',
        details: [
          'Patient-specific virtual brain twins built from diffusion-MRI structural connectomes and fitted to pre-operative MEG with a dynamic mean-field model, aimed at predicting post-operative brain activity after virtual resection',
          'Pipeline: tractography and connectome construction (MRtrix3, FreeSurfer), MEG source reconstruction (MNE-Python, LCMV beamformer)',
        ],
      },
      {
        title: 'Multilingualism and Brain Age: Harmonized MRI Preprocessing',
        org: 'Collaboration with REDLat, BarcelonaBeta and McGill',
        dates: '2026 – Present',
        details: [
          'Preprocessing about 800 BCBL scans (fMRI with fMRIPrep, T1 segmentation with CAT12) following the REDLat pipeline, for cross-site brain-age and healthy-aging analyses',
        ],
      },
    ],
    presentations: [
      {
        title: 'Energy-Based Generative Transformer Models for Neural Circuit Modeling',
        authors: ['Abolfazl HaqiqiFar', 'Reza Jafari'],
        venue: 'SNUFA',
        year: '2025',
      },
      {
        title: 'Information-Theoretic Graph Neural Networks for Modeling Brain Connectivity',
        authors: ['Abolfazl HaqiqiFar', 'Majid Saberi', 'Reza Jafari'],
        venue: 'SNUFA',
        year: '2025',
      },
      {
        title: 'Exploring Brain Energy Modeling: Insights into Autism Spectrum Disorder',
        authors: ['Abolfazl HaqiqiFar', 'Majid Saberi'],
        venue: '12th Basic and Clinical Neuroscience Congress',
        year: '2023',
      },
    ],
    skills: [
      {
        area: 'Whole-Brain Modelling',
        items:
          'Dynamic mean-field modelling (feedback inhibition control), virtual brain twins and virtual resections, model fitting and parameter estimation, stochastic dynamics, anomalous diffusion on networks',
      },
      {
        area: 'Neuroimaging & Electrophysiology',
        items:
          'Diffusion-MRI tractography and structural connectomes (MRtrix3, FSL, FreeSurfer), fMRI and T1 preprocessing (fMRIPrep, CAT12), MEG forward modelling and source reconstruction (MNE-Python, LCMV beamformer), EEG network analysis',
      },
      {
        area: 'Network Neuroscience',
        items:
          'Functional and structural connectivity, graph-theoretic analysis, temporal and signed networks, structural balance, information-theoretic measures (Transfer Entropy, Mutual Information)',
      },
      {
        area: 'Machine Learning',
        items: 'Graph neural networks, generative transformers, energy-based models, representation learning',
      },
      {
        area: 'Programming',
        items:
          'Python (PyTorch, TensorFlow, Keras, NumPy, Pandas, Scikit-learn, NetworkX), C++, MATLAB, R; HPC clusters (SLURM, SGE)',
      },
    ],
  },
}

export const content: Content =
  new URLSearchParams(window.location.search).get('v') === 'reference' ? reference : abolfazl
