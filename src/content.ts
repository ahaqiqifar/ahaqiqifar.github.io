export type Link = { label: string; href: string }

export type Publication = {
  title: string
  authors: string[]
  venue: string
  kind: 'Journal article' | 'Preprint' | 'Under review'
  date: string
  url?: string
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
  fellowships: { title: string; org: string; dates: string }[]
  presentations: { title: string; authors: string[]; venue: string; year: string; kind?: string }[]
  skills: { area: string; items: string }[]
}

export type ResearchTheme = {
  title: string
  text: string
  methods: string
  links: Link[]
}

export type Repo = { name: string; text: string; lang: string; year: string }

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
  research?: { intro: string; themes: ResearchTheme[] }
  code?: { user: string; repos: Repo[] }
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
    { label: 'Research', href: '/research/' },
    { label: 'Projects', href: '/projects/' },
    { label: 'Publications', href: '/publications/' },
    { label: 'CV', href: '/cv/' },
  ],
  social: [
    { label: 'GitHub', href: 'https://github.com/AbolfazlHaqiqiFar' },
    { label: 'Scholar', href: SCHOLAR },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/abolfazl-haqiqifar/' },
    { label: 'ORCID', href: 'https://orcid.org/0009-0003-9705-4805' },
  ],
  marquee: ['Abolfazl', 'HaqiqiFar'],
  footerLeft: ['Computational Neuroscientist', 'PhD Candidate at BCBL', 'Obsessed by the Brain'],
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
      summary:
        'Transfer entropy maps directed information flow between canonical brain networks. In autism the main hubs shift to the frontoparietal and limbic networks, feedback weakens and the backbone fragments; these flow patterns separate autistic and control groups with about 91% accuracy.',
    },
    {
      title: 'A Symphony of Genres: Driving Information Dynamics in Functional Brain Networks',
      authors: ['Abolfazl HaqiqiFar', 'Azin Shirmohammadi', 'Amirhossein Yekta', 'G. Reza Jafari'],
      venue: 'bioRxiv · under review at Scientific Reports',
      kind: 'Preprint',
      date: 'Apr 2026',
      url: 'https://doi.org/10.64898/2026.04.22.720162',
      summary:
        'EEG from 20 listeners across 12 genres: rhythmically and structurally complex music strengthens a super-rich club of hub regions, while ambient and traditional genres spread connectivity out.',
    },
    {
      title: 'Empirical evidence for structural balance theory in functional brain networks',
      authors: ['Majid Saberi', 'Abolfazl HaqiqiFar', 'AmirHussein Abdolalizadeh', 'Bratislav Misic', 'Ali Khatibi'],
      venue: 'Frontiers in Network Physiology',
      kind: 'Journal article',
      date: 'Jan 2026',
      url: 'https://doi.org/10.3389/fnetp.2025.1681597',
      summary:
        'In resting-state fMRI from the Human Connectome Project, balanced triads live longer and reach higher peak energy than imbalanced ones, beyond null models, supporting strong structural balance theory.',
    },
    {
      title: 'Inverse Ising Problem: Theory and Challenges of Higher-Order Interactions',
      authors: ['Paria Naghizadeh', 'Behrouz Askari', 'Abolfazl HaqiqiFar', 'G. Reza Jafari'],
      venue: 'Manuscript under review',
      kind: 'Under review',
      date: '2026',
      summary: 'Theory and open challenges of inferring higher-order (beyond pairwise) interactions with inverse Ising models.',
    },
  ],
  research: {
    intro:
      'I study how the brain’s wiring shapes its dynamics, and how those dynamics carry information. Trained in statistical physics and network science, I build whole-brain models and information-theoretic tools and apply them from glioma to bilingualism and dyslexia.',
    themes: [
      {
        title: 'Virtual Brain Twins',
        text: 'Patient-specific whole-brain models built from diffusion-MRI connectomes and fitted to MEG with a dynamic mean-field model. In glioma patients, these twins let us perform virtual resections and predict how brain activity will reorganise after surgery.',
        methods: 'Dynamic mean-field models · structural connectomes · MEG source reconstruction',
        links: [{ label: 'Project', href: '/projects/' }],
      },
      {
        title: 'Information Dynamics',
        text: 'How information moves between brain regions. With transfer entropy I map directed information flow between canonical brain networks: in autism, where the hubs of information flow shift and the network backbone fragments, and in EEG recorded while people listen to different music genres, where complex rhythms recruit a super-rich club of hub regions.',
        methods: 'Transfer entropy · mutual information · graph theory',
        links: [
          { label: 'Scientific Reports', href: 'https://doi.org/10.1038/s41598-026-66002-5' },
          { label: 'bioRxiv', href: 'https://doi.org/10.64898/2026.04.22.720162' },
        ],
      },
      {
        title: 'Language, Bilingualism & Dyslexia',
        text: 'How bilingual experience and the transparency of a writing system (Spanish–Basque vs. Spanish–English) shape the reading network of children aged 9–13, with and without dyslexia, combining multimodal MRI and MEG.',
        methods: 'Multimodal MRI · MEG · graph metrics · models of the visual word form area',
        links: [{ label: 'BRIDGE project', href: '/projects/' }],
      },
      {
        title: 'Signed & Higher-Order Networks',
        text: 'Statistical-physics tools for brain networks beyond simple positive, pairwise links: testing structural balance theory in signed functional networks from the Human Connectome Project, where balanced triads live longer and reach higher peak energy, and inverse Ising methods for higher-order interactions.',
        methods: 'Structural balance · signed and temporal networks · inverse Ising models',
        links: [{ label: 'Frontiers in Network Physiology', href: 'https://doi.org/10.3389/fnetp.2025.1681597' }],
      },
    ],
  },
  code: {
    user: 'https://github.com/AbolfazlHaqiqiFar',
    repos: [
      { name: 'Information-Flow-in-Brain-and-Music', text: 'Notebooks for analysing information flow in brain networks during music listening, including an autoencoder model.', lang: 'Jupyter', year: '2025' },
      { name: 'FMRI-Data-analyses', text: 'fMRI analysis notebooks: subject time series, independent components (FSL MELODIC) and correlation maps.', lang: 'Jupyter', year: '2025' },
      { name: 'BCNC1', text: 'Brain-energy modelling on the CC200 atlas, the code behind the autism talk at the Basic and Clinical Neuroscience Congress.', lang: 'Python', year: '2023' },
      { name: 'IsingModelSimulation', text: 'Monte Carlo simulation of the Ising model in 1D and 2D, from ordered, custom or random initial states.', lang: 'Python', year: '2022' },
      { name: 'Large-deviation', text: 'Large-deviation functions with Monte Carlo and Markov-chain simulations.', lang: 'Jupyter', year: '2021' },
      { name: 'Random-walk', text: 'Simulations of one- and two-dimensional random walks.', lang: 'Python', year: '2021' },
      { name: 'Particle-Swarm-Optimization', text: 'Particle swarm optimisation implemented from scratch.', lang: 'Python', year: '2021' },
      { name: 'Computational-Physics', text: 'Numerical solvers for ordinary differential equations.', lang: 'Jupyter', year: '2023' },
    ],
  },
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
        details: [
          'Advisors: Dr. Lucia Amoruso and Dr. Manuel Carreiras',
          'Research group: Neurobiology of Language',
          'Research area: Brain Network Modelling',
        ],
      },
      {
        title: 'MSc in Statistical Physics and Complex Systems',
        org: 'Department of Physics, Shahid Beheshti University',
        place: 'Tehran, Iran',
        dates: 'Sep 2023 – Dec 2025',
        details: [
          'Advisor: Dr. Reza Jafari',
          'Research area: Network Science',
          'Thesis: A Comparative Analysis of the Functional Brain Network in Controls and Individuals with Autism Spectrum Disorder using Graph Neural Networks and Hierarchical Clustering',
        ],
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
    fellowships: [{ title: 'FPI Predoctoral Fellowship', org: 'BCBL, Basque Center on Cognition, Brain and Language', dates: '2026 – 2030' }],
    presentations: [
      {
        title: 'Energy-Based Generative Transformer Models for Neural Circuit Modeling',
        authors: ['Abolfazl HaqiqiFar', 'Reza Jafari'],
        venue: 'SNUFA',
        year: '2025',
        kind: 'Flash talk',
      },
      {
        title: 'Information-Theoretic Graph Neural Networks for Modeling Brain Connectivity',
        authors: ['Abolfazl HaqiqiFar', 'Majid Saberi', 'Reza Jafari'],
        venue: 'SNUFA',
        year: '2025',
        kind: 'Poster',
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
