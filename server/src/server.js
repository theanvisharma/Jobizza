import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import jobRoutes from './routes/jobs.js';
import contactRoutes from './routes/contact.js';

// Model seeding check
import Job from './models/Job.js';
import TeamMember from './models/TeamMember.js';

// Static uploads and path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

// Connect Database
connectDB().then(() => {
  seedInitialTeam();
});

const seedInitialTeam = async () => {
  try {
    const count = await TeamMember.countDocuments();
    if (count === 0) {
      console.log('Seeding initial team members into database...');
      await TeamMember.create([
        {
          name: 'Gaurav Sharma',
          position: 'Co-Founder',
          role: 'Co-Founder',
          image: 'images/Gaurav new.png',
          linkedinUrl: 'https://www.linkedin.com/in/gaurav-sharma-60341379/',
          order: 1
        },
        {
          name: 'Aakash Andhare',
          position: 'Vice President - Delivery',
          role: 'Vice President - Delivery',
          image: 'images/Aakashnew.png',
          linkedinUrl: 'https://www.linkedin.com/in/aakashandhare/',
          order: 2
        }
      ]);
      console.log('Successfully seeded team members.');
    }
  } catch (error) {
    console.error('Error seeding team members:', error);
  }
};

const app = express();

// Middlewares
const allowedOrigins = [
  'http://localhost:5176',
  'http://localhost:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'session_secret_for_passport_auth',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to secure: true in production if HTTPS is active
}));

app.use(passport.initialize());
app.use(passport.session());

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
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
