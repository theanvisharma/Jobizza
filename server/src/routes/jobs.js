import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(
      null,
      `resume-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
    );
  },
});

// File validation
const checkFileType = (file, cb) => {
  const filetypes = /pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype =
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, or DOCX documents are allowed!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

// @desc    Get all active job listings
// @route   GET /api/jobs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ active: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single job listing
// @route   GET /api/jobs/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.id || req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job listing not found' });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a new job listing
// @route   POST /api/jobs
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { title, department, location, type, description, requirements, benefits, salaryRange } = req.body;

  try {
    const job = await Job.create({
      title,
      department,
      location,
      type,
      description,
      requirements,
      benefits,
      salaryRange,
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Apply for a job listing
// @route   POST /api/jobs/:id/apply
// @access  Public (Optionally Authenticated)
router.post('/:id/apply', (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Multer Error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, async (req, res) => {
  const { name, email, phone, linkedinProfile, coverLetter } = req.body;
  const jobId = req.params.id;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      // Clean up uploaded file if job is not found
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ success: false, message: 'Job listing not found' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload your resume file' });
    }

    const application = await Application.create({
      job: jobId,
      name,
      email,
      phone,
      linkedinProfile,
      resumePath: req.file.path,
      coverLetter,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: application,
    });
  } catch (error) {
    // Clean up uploaded file if application creation errors
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
