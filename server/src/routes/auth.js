import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_jobizza_12345', {
    expiresIn: '30d',
  });
};

// URL Sanitization helper to prevent double slashes in OAuth callbacks
const cleanAppUrl = (url) => {
  if (!url) return '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const appUrl = cleanAppUrl(process.env.APP_URL) || 'http://localhost:5000';
const linkedinCallbackUrl = process.env.LINKEDIN_CALLBACK_URL || `${appUrl}/api/auth/linkedin/callback`;

// --- LinkedIn Passport Setup ---
const hasLinkedInCredentials =
  process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET;

if (hasLinkedInCredentials) {
  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: linkedinCallbackUrl,
        scope: ['r_emailaddress', 'r_liteprofile'],
        state: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const name = profile.displayName;
          const linkedinId = profile.id;

          let user = await User.findOne({ email });

          if (user) {
            if (!user.linkedinId) {
              user.linkedinId = linkedinId;
              await user.save();
            }
            return done(null, user);
          }

          user = await User.create({
            name,
            email,
            linkedinId,
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// Passport serialization
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// @desc    LinkedIn Auth initiation
// @route   GET /api/auth/linkedin
// @access  Public
router.get('/linkedin', (req, res, next) => {
  if (hasLinkedInCredentials) {
    passport.authenticate('linkedin')(req, res, next);
  } else {
    // Falls back to mock OAuth mode if credentials are empty
    console.log('LinkedIn Client ID not configured. Using Mock OAuth redirect.');
    res.redirect('/api/auth/linkedin/mock-callback');
  }
});

// @desc    LinkedIn Auth callback
// @route   GET /api/auth/linkedin/callback
// @access  Public
router.get(
  '/linkedin/callback',
  (req, res, next) => {
    if (hasLinkedInCredentials) {
      passport.authenticate('linkedin', { failureRedirect: '/login' })(req, res, next);
    } else {
      res.redirect('/api/auth/linkedin/mock-callback');
    }
  },
  (req, res) => {
    // Successful authentication, redirect to frontend with token
    const token = generateToken(req.user._id);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/oauth-success?token=${token}`);
  }
);

// @desc    Mock LinkedIn Auth Callback for testing when API keys are absent
// @route   GET /api/auth/linkedin/mock-callback
// @access  Public
router.get('/linkedin/mock-callback', async (req, res) => {
  try {
    const mockEmail = 'linkedin_candidate@jobizza.com';
    let user = await User.findOne({ email: mockEmail });

    if (!user) {
      user = await User.create({
        name: 'LinkedIn Candidate (Mock)',
        email: mockEmail,
        linkedinId: 'mock_linkedin_1234567890',
      });
    }

    const token = generateToken(user._id);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/oauth-success?token=${token}`);
  } catch (error) {
    console.error('Mock OAuth error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
