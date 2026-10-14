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
  viz?: 'fit' | 'flow' | 'reading' | 'balance' // interactive figure shown next to the theme
}

export type Repo = { name: string; text: string; lang: string; year: string }

export type ProjectBlock = { heading?: string; text?: string; list?: string[]; ordered?: boolean }

export type Project = {
  id: string // anchor on the Projects page
  title: string
  lead: string
  meta: string[]
  blocks: ProjectBlock[]
  methods: string
  links?: Link[]
  viz: 'reading' | 'twin' | 'recurrence' | 'weather' | 'higher-order'
}

export type About = {
  bio: string
  facts: { label: string; value: string }[]
  path: { years: string; title: string; place: string }[]
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
  about?: About
  research?: { intro: string; themes: ResearchTheme[] }
  projects?: Project[]
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
  about: {
    bio: 'I’m a computational neuroscientist and FPI predoctoral fellow at the Basque Center on Cognition, Brain and Language (BCBL) in San Sebastián, in the Neurobiology of Language group. Coming from statistical physics and network science, I build models of whole-brain dynamics and tools to measure how information moves through the brain.',
    facts: [
      { label: 'Now', value: 'PhD candidate, BCBL' },
      { label: 'Fellowship', value: 'FPI, 2026 – 2030' },
      { label: 'Advisors', value: 'Lucia Amoruso & Manuel Carreiras' },
      { label: 'Based in', value: 'San Sebastián, Spain' },
    ],
    path: [
      { years: '2018 – 2022', title: 'BSc in Physics', place: 'Bu-Ali Sina University, Hamedan' },
      { years: '2023 – 2025', title: 'MSc, Statistical Physics & Complex Systems', place: 'Shahid Beheshti University, Tehran' },
      { years: '2026 –', title: 'PhD, Brain Network Modelling', place: 'BCBL, San Sebastián' },
    ],
  },
  research: {
    intro:
      'I study how the brain’s wiring shapes its dynamics, and how those dynamics carry information. Trained in statistical physics and network science, I build whole-brain models and information-theoretic tools and apply them from glioma to bilingualism and dyslexia.',
    themes: [
      {
        title: 'Virtual Brain Twins',
        text: 'Patient-specific whole-brain models built from diffusion-MRI connectomes and fitted to MEG with a dynamic mean-field model. In glioma patients, these twins let us perform virtual resections and predict how brain activity will reorganise after surgery.',
        methods: 'Dynamic mean-field models · structural connectomes · MEG source reconstruction',
        viz: 'fit',
        links: [{ label: 'Project', href: '/projects/#virtual-brain-twins' }],
      },
      {
        title: 'Information Dynamics',
        text: 'How information moves between brain regions. With transfer entropy I map directed information flow between canonical brain networks: in autism, where the hubs of information flow shift and the network backbone fragments, and in EEG recorded while people listen to different music genres, where complex rhythms recruit a super-rich club of hub regions.',
        methods: 'Transfer entropy · mutual information · graph theory',
        viz: 'flow',
        links: [
          { label: 'Scientific Reports', href: 'https://doi.org/10.1038/s41598-026-66002-5' },
          { label: 'bioRxiv', href: 'https://doi.org/10.64898/2026.04.22.720162' },
        ],
      },
      {
        title: 'Language, Bilingualism & Dyslexia',
        text: 'How bilingual experience and the transparency of a writing system (Spanish–Basque vs. Spanish–English) shape the reading network of children aged 9–13, with and without dyslexia, combining multimodal MRI and MEG.',
        methods: 'Multimodal MRI · MEG · graph metrics · models of the visual word form area',
        viz: 'reading',
        links: [{ label: 'BRIDGE project', href: '/projects/#reading-brain' }],
      },
      {
        title: 'Signed & Higher-Order Networks',
        text: 'Statistical-physics tools for brain networks beyond simple positive, pairwise links: testing structural balance theory in signed functional networks from the Human Connectome Project, where balanced triads live longer and reach higher peak energy, and inverse Ising methods for higher-order interactions.',
        methods: 'Structural balance · signed and temporal networks · inverse Ising models',
        viz: 'balance',
        links: [{ label: 'Frontiers in Network Physiology', href: 'https://doi.org/10.3389/fnetp.2025.1681597' }],
      },
    ],
  },
  projects: [
    {
      id: 'reading-brain',
      title: 'Bilingualism, Orthographic Transparency, and the Reading Brain',
      lead: 'How does learning to read in more than one language change the brain’s reading network?',
      meta: [
        'PhD project · BRIDGE, BCBL',
        'Supervised by Manuel Carreiras and Lucia Amoruso',
        'Funded under BRIDGE (PID2024-159134OB-I00)',
      ],
      blocks: [
        {
          text: 'This PhD project, part of the BRIDGE project at the BCBL (Basque Center on Cognition, Brain and Language), investigates how bilingual experience and the transparency of a writing system shape the reading circuit in children aged 9 to 13, both in typical readers and in children with dyslexia.',
        },
        {
          text: 'The study compares two language pairings: Spanish–Basque, where both orthographies are transparent, and Spanish–English, where a transparent orthography is paired with an opaque one. This contrast makes it possible to separate the effect of bilingualism itself from the effect of the spelling-to-sound consistency of each language.',
        },
        {
          text: 'The project combines structural and functional MRI, diffusion MRI, and MEG with behavioural measures of reading, phonological processing, and visual attention span. Analyses draw on network science and information theory, including graph-theoretic metrics and transfer entropy, together with computational models of the visual word form area, to characterise how information flows through the reading network across groups.',
        },
        {
          text: 'The aim is a mechanistic account of how language experience and orthography jointly shape reading development, with implications for understanding and supporting dyslexia in multilingual settings.',
        },
      ],
      methods: 'Structural & functional MRI · diffusion MRI · MEG · graph theory · transfer entropy · models of the visual word form area',
      viz: 'reading',
    },
    {
      id: 'virtual-brain-twins',
      title: 'Virtual Brain Twins for Glioma Patients',
      lead: 'Personalised computer models of the brains of patients with glioma, built to simulate what surgery would do to brain activity before it happens.',
      meta: ['PhD project · BCBL', 'Supervised by Lucia Amoruso and Manuel Carreiras'],
      blocks: [
        {
          text: 'I build personalised computer models of the brains of patients with glioma, a type of brain tumour. Each model, or “twin”, is built from the patient’s own MRI scans and fitted to their own magnetoencephalography (MEG) recording. The goal is to simulate what surgery would do to brain activity before it happens.',
        },
        {
          heading: 'The question',
          text: 'Removing a glioma means removing, or disconnecting, part of the brain’s wiring. Surgeons plan carefully, but it is hard to know in advance how the rest of the brain will respond. This project asks whether a patient-specific computational model can help answer that.',
        },
        {
          heading: 'The approach',
          text: 'For each patient, I build a virtual copy of their brain in three steps:',
          ordered: true,
          list: [
            'Wiring. From diffusion MRI and tractography, I reconstruct each patient’s structural connectome, the map of white-matter connections between brain regions.',
            'Dynamics. I place a neural mass model (a dynamic mean-field model) on that wiring and tune it so the simulated activity matches the patient’s own resting-state MEG.',
            'Virtual surgery. I remove the resected region from the model and compare the simulated activity with what is observed after surgery.',
          ],
        },
        {
          heading: 'What I’m investigating',
          list: [
            'How well a model fitted to one patient’s MEG can reproduce their brain activity.',
            'Whether virtual resections agree with the clinical records of what was actually removed.',
            'How robust the results are to modelling choices such as brain atlas, source reconstruction and noise.',
            'Whether MEG-based twins perform better than fMRI-based twins for the same patients.',
          ],
        },
        {
          heading: 'Why it matters',
          text: 'If the twins prove reliable, they could eventually help clinicians estimate the functional consequences of a resection for an individual patient.',
        },
      ],
      methods: 'Diffusion MRI & tractography · structural connectomes · dynamic mean-field models · resting-state MEG',
      viz: 'twin',
    },
    {
      id: 'glioma-recurrence',
      title: 'Predicting where gliomas recur: a patient-specific model of tumour spread',
      lead: 'Gliomas almost always return after surgery, sometimes several centimetres from the original site.',
      meta: ['Public dataset of 243 patients · own cohort of 64 patients, 41 scanned before and after surgery'],
      blocks: [
        {
          text: 'Gliomas almost always return after surgery, sometimes several centimetres from the original site. Standard growth models, in which tumour cells multiply and diffuse evenly outward, cannot explain these distant recurrences.',
        },
        {
          text: 'This project builds a personalised model of glioma spread for each patient from pre-surgical brain imaging, and tests two ideas. The first is that tumour cells travel along the brain’s white-matter wiring in long jumps, which we describe with anomalous (fractional) diffusion that contains the standard model as a special case. The second is that tumours grow faster in regions functionally connected to them, measured with resting-state fMRI.',
        },
        {
          text: 'Each idea adds only one or two parameters to the standard model, and is kept only if it predicts the true recurrence location better in patients the model has not seen. The diffusion question is tested on a public dataset of 243 patients. The fMRI question is tested on our own cohort of 64 patients, 41 of them scanned before and after surgery.',
        },
        {
          text: 'The long-term aim is a tool that indicates where a tumour is likely to return, to support surgical and radiotherapy planning.',
        },
      ],
      methods: 'Reaction–diffusion models · anomalous (fractional) diffusion · tractography · resting-state fMRI · out-of-sample validation',
      viz: 'recurrence',
    },
    {
      id: 'texas-weather',
      title: 'Network Analysis of Weather Extremes in Texas',
      lead: 'Can information flow between locations help predict extreme weather?',
      meta: ['Data: NOAA AORC · 8 meteorological variables · 245 locations · daily, 1981–2025'],
      blocks: [
        {
          text: 'This project models Texas weather as a network and asks whether information flow between locations can help predict extreme events. I use NOAA’s AORC gridded dataset: eight meteorological variables, daily, at 245 points across Texas from 1981 to 2025.',
        },
        {
          text: 'After detrending each location’s time series, I build a directed network between locations using transfer entropy, which quantifies how much one site’s past reduces uncertainty about another’s future.',
        },
        {
          text: 'The goal is a prediction approach for weather extremes that draws on network science rather than standard forecasting methods, with the structure of directed influence across the state as the starting point.',
        },
      ],
      methods: 'Transfer entropy · directed networks · time-series detrending · extreme-event prediction',
      viz: 'weather',
    },
    {
      id: 'higher-order-interactions',
      title: 'Detecting Higher-Order Interactions Beyond the Inverse Ising Model',
      lead: 'What happens to pairwise models when the real system also contains three-body interactions?',
      meta: ['With Paria Naghizadeh, Behrouz Askari and Reza Jafari'],
      blocks: [
        {
          text: 'Many complex systems, from neural populations to financial markets, are modelled with the Ising model, which assumes that all interactions are pairwise. Inverse Ising methods (independent-pair, naive mean-field, susceptibility-propagation and TAP) try to recover those pairwise couplings from observed correlations. This project asks what happens when the real system also contains three-body interactions.',
        },
        {
          text: 'We show that the standard pairwise inversion schemes become unreliable in that regime, and that the reconstruction errors carry a signature of the missing higher-order structure. We use this to build a machine-learning classifier trained on the eigenvalue spectra of correlation matrices. It flags whether a system’s dynamics are purely pairwise or involve higher-order interactions, without requiring the interactions themselves to be inferred first.',
        },
        {
          text: 'We then apply the approach to S&P 500 stock data, where a pairwise description is commonly assumed.',
        },
      ],
      methods: 'Inverse Ising (independent-pair, naive mean-field, susceptibility propagation, TAP) · eigenvalue spectra · machine learning · S&P 500 data',
      links: [{ label: 'Manuscript under review', href: '/publications/' }],
      viz: 'higher-order',
    },
  ],
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
  typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('v') === 'reference' ? reference : abolfazl
