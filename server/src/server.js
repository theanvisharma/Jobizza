import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import contactRoutes from './routes/contact.js';

// Model seeding check
import Job from './models/Job.js';

// Environment variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Static uploads serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date() });
});

// Seed database with jobs if empty
const seedJobs = async () => {
  try {
    const count = await Job.countDocuments();
    if (count === 0) {
      console.log('Seeding initial Job Listings to database...');
      const initialJobs = [
        {
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
      await Job.insertMany(initialJobs);
      console.log('Successfully seeded initial jobs!');
    }
  } catch (error) {
    console.error('Error seeding jobs:', error);
  }
};

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await seedJobs();
});
