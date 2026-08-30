import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import { isAuth } from '../middleware/auth.js';
import { sendOTPEmail } from '../config/nodemailer.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_jobizza_12345', {
    expiresIn: '30d',
  });
};

// Main Admins list
const MAIN_ADMINS = ['theanvisharma@gmail.com', 'sriteshh77@gmail.com', 'sritesh77@gmail.com'];

// Helper to check and provision main admin properties
const checkAndProvisionAdmin = (user) => {
  if (user && user.email && MAIN_ADMINS.includes(user.email.toLowerCase())) {
    user.role = 'admin';
    user.isMainAdmin = true;
    user.status = 'accepted';
    user.isEmailVerified = true;
  }
};

// URL Sanitization helper to prevent double slashes in OAuth callbacks
const cleanAppUrl = (url) => {
  if (!url) return '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const appUrl = cleanAppUrl(process.env.APP_URL) || 'http://localhost:5000';
const linkedinCallbackUrl = process.env.LINKEDIN_CALLBACK_URL || `${appUrl}/api/auth/linkedin/callback`;
const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL || `${appUrl}/api/auth/google/callback`;

// --- Passport LinkedIn Setup ---
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
          const profileImage = profile.photos && profile.photos[0] ? profile.photos[0].value : (profile._json && profile._json.pictureUrl ? profile._json.pictureUrl : '');

          let user = await User.findOne({ email });

          if (user) {
            if (!user.linkedinId) user.linkedinId = linkedinId;
            if (profileImage) user.profileImage = profileImage;
            checkAndProvisionAdmin(user);
            await user.save();
            return done(null, user);
          }

          user = new User({
            name,
            email,
            linkedinId,
            profileImage,
          });
          checkAndProvisionAdmin(user);
          await user.save();

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// --- Passport Google Setup ---
const hasGoogleCredentials =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

if (hasGoogleCredentials) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: googleCallbackUrl,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const name = profile.displayName;
          const googleId = profile.id;
          const profileImage = profile.photos && profile.photos[0] ? profile.photos[0].value : '';

          let user = await User.findOne({ email });

          if (user) {
            if (!user.googleId) user.googleId = googleId;
            if (profileImage) user.profileImage = profileImage;
            checkAndProvisionAdmin(user);
            await user.save();
            return done(null, user);
          }

          user = new User({
            name,
            email,
            googleId,
            profileImage,
          });
          checkAndProvisionAdmin(user);
          await user.save();

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

// @desc    Initiate LinkedIn Auth
// @route   GET /api/auth/linkedin
router.get('/linkedin', (req, res, next) => {
  const role = req.query.role || 'member';
  req.session.requestedRole = role;
  if (hasLinkedInCredentials) {
    passport.authenticate('linkedin')(req, res, next);
  } else {
    console.log('LinkedIn Client ID not configured. Using Mock OAuth redirect.');
    const email = req.query.email || '';
    res.redirect(`/api/auth/linkedin/mock-callback?email=${email}&role=${role}`);
  }
});

// @desc    LinkedIn Auth callback
// @route   GET /api/auth/linkedin/callback
router.get(
  '/linkedin/callback',
  (req, res, next) => {
    if (hasLinkedInCredentials) {
      passport.authenticate('linkedin', { failureRedirect: '/login' })(req, res, next);
    } else {
      const email = req.query.email || '';
      const role = req.query.role || req.session.requestedRole || 'member';
      res.redirect(`/api/auth/linkedin/mock-callback?email=${email}&role=${role}`);
    }
  },
  (req, res) => {
    const role = req.session.requestedRole || 'member';
    const email = req.user.email;
    const isMainAdminEmail = MAIN_ADMINS.includes(email.toLowerCase());
    
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    
    if (role === 'admin' && !isMainAdminEmail) {
      return res.redirect(`${clientUrl}/login?error=${encodeURIComponent('Access denied. Only authorized main admins can log in as admin.')}`);
    }
    if (role === 'member' && isMainAdminEmail) {
      return res.redirect(`${clientUrl}/login?error=${encodeURIComponent('Try logging in as admin.')}`);
    }

    const token = generateToken(req.user._id);
    res.redirect(`${clientUrl}/oauth-success?token=${token}`);
  }
);

// @desc    Mock LinkedIn Auth Callback for testing when API keys are absent
// @route   GET /api/auth/linkedin/mock-callback
router.get('/linkedin/mock-callback', async (req, res) => {
  try {
    const mockEmail = req.query.email || 'linkedin_candidate@jobizza.com';
    const role = req.query.role || req.session.requestedRole || 'member';
    
    const isMainAdminEmail = MAIN_ADMINS.includes(mockEmail.toLowerCase());
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    
    if (role === 'admin' && !isMainAdminEmail) {
      return res.redirect(`${clientUrl}/login?error=${encodeURIComponent('Access denied. Only authorized main admins can log in as admin.')}`);
    }
    if (role === 'member' && isMainAdminEmail) {
      return res.redirect(`${clientUrl}/login?error=${encodeURIComponent('Try logging in as admin.')}`);
    }

    let user = await User.findOne({ email: mockEmail });

    if (!user) {
      user = new User({
        name: mockEmail.split('@')[0],
        email: mockEmail,
        linkedinId: 'mock_linkedin_' + Date.now(),
      });
    } else if (!user.linkedinId) {
      user.linkedinId = 'mock_linkedin_' + Date.now();
    }
    
    checkAndProvisionAdmin(user);
    await user.save();

    const token = generateToken(user._id);
    res.redirect(`${clientUrl}/oauth-success?token=${token}`);
  } catch (error) {
    console.error('Mock LinkedIn OAuth error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Initiate Google Auth
// @route   GET /api/auth/google
router.get('/google', (req, res, next) => {
  const role = req.query.role || 'member';
  req.session.requestedRole = role;
  if (hasGoogleCredentials) {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  } else {
    console.log('Google Client ID not configured. Using Mock OAuth redirect.');
    const email = req.query.email || '';
    res.redirect(`/api/auth/google/mock-callback?email=${email}&role=${role}`);
  }
});

// @desc    Google Auth callback
// @route   GET /api/auth/google/callback
router.get(
  '/google/callback',
  (req, res, next) => {
    if (hasGoogleCredentials) {
      passport.authenticate('google', { failureRedirect: '/login' })(req, res, next);
    } else {
      const email = req.query.email || '';
      const role = req.query.role || req.session.requestedRole || 'member';
      res.redirect(`/api/auth/google/mock-callback?email=${email}&role=${role}`);
    }
  },
  (req, res) => {
    const role = req.session.requestedRole || 'member';
    const email = req.user.email;
    const isMainAdminEmail = MAIN_ADMINS.includes(email.toLowerCase());
    
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    
    if (role === 'admin' && !isMainAdminEmail) {
      return res.redirect(`${clientUrl}/login?error=${encodeURIComponent('Access denied. Only authorized main admins can log in as admin.')}`);
    }
    if (role === 'member' && isMainAdminEmail) {
      return res.redirect(`${clientUrl}/login?error=${encodeURIComponent('Try logging in as admin.')}`);
    }

    const token = generateToken(req.user._id);
    res.redirect(`${clientUrl}/oauth-success?token=${token}`);
  }
);

// @desc    Mock Google Auth Callback for testing when API keys are absent
// @route   GET /api/auth/google/mock-callback
router.get('/google/mock-callback', async (req, res) => {
  try {
    const mockEmail = req.query.email || 'google_candidate@jobizza.com';
    const role = req.query.role || req.session.requestedRole || 'member';
    
    const isMainAdminEmail = MAIN_ADMINS.includes(mockEmail.toLowerCase());
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    
    if (role === 'admin' && !isMainAdminEmail) {
      return res.redirect(`${clientUrl}/login?error=${encodeURIComponent('Access denied. Only authorized main admins can log in as admin.')}`);
    }
    if (role === 'member' && isMainAdminEmail) {
      return res.redirect(`${clientUrl}/login?error=${encodeURIComponent('Try logging in as admin.')}`);
    }

    let user = await User.findOne({ email: mockEmail });

    if (!user) {
      user = new User({
        name: mockEmail.split('@')[0],
        email: mockEmail,
        googleId: 'mock_google_' + Date.now(),
      });
    } else if (!user.googleId) {
      user.googleId = 'mock_google_' + Date.now();
    }
    
    checkAndProvisionAdmin(user);
    await user.save();

    const token = generateToken(user._id);
    res.redirect(`${clientUrl}/oauth-success?token=${token}`);
  } catch (error) {
    console.error('Mock Google OAuth error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Start Email Login / OTP Verification flow
// @route   POST /api/auth/manual
router.post('/manual', async (req, res) => {
  const { email, role } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide an email address' });
  }

  const isMainAdminEmail = MAIN_ADMINS.includes(email.toLowerCase());
  if (role === 'admin' && !isMainAdminEmail) {
    return res.status(400).json({ success: false, message: 'Access denied. Only authorized main admins can log in as admin.' });
  }
  if (role === 'member' && isMainAdminEmail) {
    return res.status(400).json({ success: false, message: 'Try logging in as admin.' });
  }

  try {
    let user = await User.findOne({ email });

    // Generate 6 digit numeric OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    if (!user) {
      // Create user if registering for the first time
      user = new User({
        name: email.split('@')[0],
        email,
        otp,
        otpExpires,
      });
    } else {
      user.otp = otp;
      user.otpExpires = otpExpires;
    }

    await user.save();

    // Send the email OTP notification
    await sendOTPEmail(user.email, otp);

    res.json({ success: true, message: 'Verification OTP sent to your email.' });
  } catch (error) {
    console.error('Manual Auth error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Verify OTP and log in
// @route   POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { email, otp, role } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Please provide email and OTP code' });
  }

  const isMainAdminEmail = MAIN_ADMINS.includes(email.toLowerCase());
  if (role === 'admin' && !isMainAdminEmail) {
    return res.status(400).json({ success: false, message: 'Access denied. Only authorized main admins can log in as admin.' });
  }
  if (role === 'member' && isMainAdminEmail) {
    return res.status(400).json({ success: false, message: 'Try logging in as admin.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code' });
    }

    // Clear OTP fields upon successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isEmailVerified = true;

    // Check if user is one of the Main Admins and provision immediately
    checkAndProvisionAdmin(user);
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isMainAdmin: user.isMainAdmin,
        status: user.status,
        profileComplete: user.profileComplete,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Resend OTP to email
// @route   POST /api/auth/resend-otp
router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide an email address' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry
    await user.save();

    await sendOTPEmail(user.email, otp);
    res.json({ success: true, message: 'OTP code resent successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Complete profile details during onboarding
// @route   POST /api/auth/complete-profile
router.post('/complete-profile', isAuth, async (req, res) => {
  const { name, company, position, city, pincode, linkedin, dob } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    user.company = company || user.company;
    user.position = position || user.position;
    user.city = city || user.city;
    user.pincode = pincode || user.pincode;
    user.linkedin = linkedin || user.linkedin;
    if (dob) user.dob = new Date(dob);
    
    user.profileComplete = true;
    
    // Maintain accepted status for admins, otherwise mark as pending review
    if (user.role !== 'admin') {
      user.status = 'pending';
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile completed successfully!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isMainAdmin: user.isMainAdmin,
        status: user.status,
        profileComplete: user.profileComplete,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get user profile details
// @route   GET /api/auth/me
router.get('/me', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
