export interface JobItem {
  _id: string;
  title: string;
  department: 'Engineering' | 'Cloud' | 'HR/Staffing' | 'UI/UX';
  location: string;
  type: 'Full-time' | 'Contract' | 'Part-time' | 'Remote' | 'Hybrid';
  description: string;
  requirements: string[];
  benefits: string[];
  salaryRange: string;
}

export const fallbackJobs: JobItem[] = [
  {
    _id: '1',
    title: 'Senior Full-Stack Engineer (React/Node)',
    department: 'Engineering',
    location: 'Pune (Hybrid)',
    type: 'Full-time',
    description: 'We are seeking a senior full-stack software developer experienced in building web applications at scale with React, Node.js, and MongoDB.',
    requirements: [
      '5+ years experience with React, Express, Node.js, and MongoDB',
      'Solid experience with Git, REST APIs, and responsive UI design',
      'Knowledge of cloud services (AWS or Azure) and containerization'
    ],
    benefits: [
      'Competitive salary & performance bonuses',
      'Comprehensive health insurance & wellness programs',
      'Flexible hybrid work configuration'
    ],
    salaryRange: '₹12,00,000 - ₹18,00,000 P.A.'
  },
  {
    _id: '2',
    title: 'Cloud DevOps Architect',
    department: 'Cloud',
    location: 'Pune (Remote)',
    type: 'Contract',
    description: 'Looking for a DevOps engineer who can lead cloud infrastructure migrations, orchestrate CI/CD pipelines, and secure cloud clusters.',
    requirements: [
      '3+ years DevOps experience with AWS/Azure and Terraform',
      'Strong hands-on experience in Docker, Kubernetes, and CI/CD pipelines',
      'Background in scripting (Bash, Python, or Go)'
    ],
    benefits: [
      'Remote working opportunities',
      'Exposure to diverse enterprise tech environments',
      'Professional training/certification reimbursements'
    ],
    salaryRange: '₹15,00,000 - ₹22,00,000 P.A.'
  },
  {
    _id: '3',
    title: 'Lead IT Technical Recruiter',
    department: 'HR/Staffing',
    location: 'Pune (On-site)',
    type: 'Full-time',
    description: 'Join our workforce staffing team to source, screen, and interview elite technology candidates for top enterprise clients.',
    requirements: [
      '4+ years sourcing IT talent and managing client relations',
      'Strong communication and screening skills for technical roles',
      'Familiarity with ATS software and LinkedIn Recruiter'
    ],
    benefits: [
      'Uncapped placement commission structures',
      'Premium health benefits package',
      'Dynamic, engaging office atmosphere'
    ],
    salaryRange: '₹6,00,000 - ₹9,00,000 P.A.'
  },
  {
    _id: '4',
    title: 'UX/UI Product Designer',
    department: 'UI/UX',
    location: 'Pune (Hybrid)',
    type: 'Full-time',
    description: 'We are seeking a UI/UX Designer to own end-to-end design frameworks, creating engaging modern mockups, wireframes, and responsive user flows.',
    requirements: [
      '3+ years experience with Figma, Adobe XD, and web responsive layouts',
      'Stellar portfolio demonstrating customer journey mapping and typography',
      'Familiarity with component-driven designs'
    ],
    benefits: [
      'MacBook Pro developer workstation provided',
      'Creative workspace with paid leaves policy',
      'Quarterly team learning allowances'
    ],
    salaryRange: '₹8,00,000 - ₹12,00,000 P.A.'
  }
];
