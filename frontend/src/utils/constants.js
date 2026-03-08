export const API_URL = 'http://localhost:8000/api/v1';

export const PAPER_STATUSES = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  REVISION_REQUIRED: 'revision_required',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  PUBLISHED: 'published',
};

export const PAPER_STATUS_LABELS = {
  [PAPER_STATUSES.DRAFT]: 'Draft',
  [PAPER_STATUSES.SUBMITTED]: 'Submitted',
  [PAPER_STATUSES.UNDER_REVIEW]: 'Under Review',
  [PAPER_STATUSES.REVISION_REQUIRED]: 'Revision Required',
  [PAPER_STATUSES.ACCEPTED]: 'Accepted',
  [PAPER_STATUSES.REJECTED]: 'Rejected',
  [PAPER_STATUSES.PUBLISHED]: 'Published',
};

export const PAPER_STATUS_VARIANTS = {
  [PAPER_STATUSES.DRAFT]: 'info',
  [PAPER_STATUSES.SUBMITTED]: 'info',
  [PAPER_STATUSES.UNDER_REVIEW]: 'warning',
  [PAPER_STATUSES.REVISION_REQUIRED]: 'warning',
  [PAPER_STATUSES.ACCEPTED]: 'success',
  [PAPER_STATUSES.REJECTED]: 'error',
  [PAPER_STATUSES.PUBLISHED]: 'success',
};

export const USER_ROLES = {
  AUTHOR: 'author',
  REVIEWER: 'reviewer',
  EDITOR: 'editor',
  ADMIN: 'admin',
};

export const CATEGORIES = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Biology',
  'Chemistry',
  'Engineering',
  'Medicine',
  'Social Sciences',
  'Economics',
  'Environmental Science',
  'Materials Science',
  'Artificial Intelligence',
  'Data Science',
  'Neuroscience',
  'Psychology',
];

export const PLACEHOLDER_PAPERS = [
  {
    id: 1,
    title: 'Advances in Transformer Architecture for Natural Language Understanding',
    authors: [
      { name: 'Dr. Sarah Chen', affiliation: 'MIT' },
      { name: 'Prof. James Wright', affiliation: 'Stanford University' },
    ],
    abstract: 'This paper presents novel modifications to the transformer architecture that significantly improve performance on natural language understanding benchmarks while reducing computational requirements by 40%.',
    category: 'Artificial Intelligence',
    status: 'published',
    keywords: ['transformers', 'NLP', 'deep learning', 'attention mechanisms'],
    date: '2026-02-15',
    doi: '10.1234/ira.2026.001',
    volume: 3,
    issue: 1,
  },
  {
    id: 2,
    title: 'Quantum Error Correction Using Topological Codes: A Comprehensive Survey',
    authors: [
      { name: 'Dr. Priya Patel', affiliation: 'Caltech' },
      { name: 'Dr. Michael Torres', affiliation: 'IBM Research' },
    ],
    abstract: 'We present a comprehensive survey of topological quantum error correction codes, analyzing their theoretical foundations, practical implementations, and current limitations in achieving fault-tolerant quantum computation.',
    category: 'Physics',
    status: 'published',
    keywords: ['quantum computing', 'error correction', 'topological codes'],
    date: '2026-01-28',
    doi: '10.1234/ira.2026.002',
    volume: 3,
    issue: 1,
  },
  {
    id: 3,
    title: 'CRISPR-Cas13 Applications in Rapid Diagnostic Testing for Emerging Pathogens',
    authors: [
      { name: 'Dr. Emily Rodriguez', affiliation: 'Johns Hopkins University' },
      { name: 'Dr. Kenji Nakamura', affiliation: 'University of Tokyo' },
      { name: 'Prof. Anna Kowalski', affiliation: 'Max Planck Institute' },
    ],
    abstract: 'This study demonstrates a novel CRISPR-Cas13 based diagnostic platform capable of detecting emerging viral pathogens within 30 minutes, with sensitivity comparable to RT-PCR methods.',
    category: 'Biology',
    status: 'published',
    keywords: ['CRISPR', 'diagnostics', 'virology', 'point-of-care testing'],
    date: '2026-02-02',
    doi: '10.1234/ira.2026.003',
    volume: 3,
    issue: 1,
  },
  {
    id: 4,
    title: 'Federated Learning with Differential Privacy: Balancing Utility and Security',
    authors: [
      { name: 'Dr. Alex Kumar', affiliation: 'Google Research' },
    ],
    abstract: 'We propose a novel federated learning framework that achieves near-optimal utility while providing strong differential privacy guarantees for individual client data.',
    category: 'Computer Science',
    status: 'under_review',
    keywords: ['federated learning', 'differential privacy', 'machine learning'],
    date: '2026-02-20',
    volume: 3,
    issue: 2,
  },
  {
    id: 5,
    title: 'Sustainable Carbon Capture Using Metal-Organic Frameworks',
    authors: [
      { name: 'Prof. Lisa Chang', affiliation: 'UC Berkeley' },
      { name: 'Dr. Omar Hassan', affiliation: 'KAUST' },
    ],
    abstract: 'This research presents a new class of metal-organic frameworks optimized for industrial-scale carbon capture, achieving 95% CO2 separation efficiency at ambient conditions.',
    category: 'Environmental Science',
    status: 'accepted',
    keywords: ['carbon capture', 'MOFs', 'sustainability', 'climate change'],
    date: '2026-03-01',
    volume: 3,
    issue: 2,
  },
  {
    id: 6,
    title: 'Neural Correlates of Decision-Making Under Uncertainty: An fMRI Study',
    authors: [
      { name: 'Dr. Rebecca Foster', affiliation: 'Oxford University' },
      { name: 'Dr. David Kim', affiliation: 'Seoul National University' },
    ],
    abstract: 'Using high-resolution fMRI, we identify distinct neural circuits involved in decision-making under varying levels of uncertainty, revealing a novel role for the anterior insula.',
    category: 'Neuroscience',
    status: 'published',
    keywords: ['decision-making', 'fMRI', 'uncertainty', 'neuroscience'],
    date: '2026-01-15',
    doi: '10.1234/ira.2026.006',
    volume: 3,
    issue: 1,
  },
];
