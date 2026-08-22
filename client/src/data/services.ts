export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  iconName: string;
  features: string[];
}

export const servicesData: ServiceItem[] = [
  {
    id: 'staffing',
    title: 'Workforce & Staffing Solutions',
    shortDescription: 'Acquire top-tier talent through permanent hiring, contract staffing, and dedicated offshore development teams.',
    longDescription: 'We help you scale your business with vetted talent. From permanent executive searches to rapid contract staffing and dedicated offshore developers, we align elite candidates to match your project needs and cultural ecosystem.',
    iconName: 'Users',
    features: [
      'Vetted Top 3% Tech Talent',
      'Contract-to-Hire and Direct Placement',
      'Dedicated Remote Developer Hubs',
      'Rapid Turnaround (avg. 72 hours to shortlist)'
    ]
  },
  {
    id: 'development',
    title: 'Web & Mobile App Development',
    shortDescription: 'Build scalable full-stack web platforms, native iOS/Android apps, and cross-platform mobile solutions.',
    longDescription: 'Our software engineering team designs and delivers robust, high-performance web applications and mobile apps. We leverage cutting-edge architectures to build products that scale with your customer base and optimize user engagement.',
    iconName: 'Code2',
    features: [
      'Full-Stack React, Node.js, and Mobile Apps',
      'Cross-Platform React Native & Flutter Apps',
      'Secure, High-Performance REST & GraphQL APIs',
      'Agile Software Development Lifecycle'
    ]
  },
  {
    id: 'cloud',
    title: 'Digital Transformation & Cloud',
    shortDescription: 'Accelerate growth with cloud migration, DevOps, API integrations, and legacy code modernization.',
    longDescription: 'Transition away from outdated systems to agile cloud infrastructures. We deliver end-to-end cloud migrations, automate infrastructure deployment with CI/CD and DevOps, and integrate legacy systems seamlessly using modern API architectures.',
    iconName: 'CloudLightning',
    features: [
      'AWS, Azure, and Google Cloud Migrations',
      'Infrastructure as Code (Terraform) & CI/CD Pipelines',
      'Legacy PHP/Monolith Modernization',
      'Kubernetes & Microservices Orchestration'
    ]
  },
  {
    id: 'enterprise',
    title: 'Custom Enterprise Software',
    shortDescription: 'Design bespoke CRM/ERP implementations, backend systems, and automated workflow pipelines.',
    longDescription: 'Supercharge your operations with tailormade enterprise software. We design and develop custom CRM, ERP, and database solutions that automate complex administrative workflows, centralize business intelligence, and eliminate data silos.',
    iconName: 'Briefcase',
    features: [
      'Bespoke CRM & ERP Solutions',
      'Business Workflow Automation',
      'Highly Available Backend Database Architecture',
      'Data Analytics & BI Dashboards'
    ]
  }
];
