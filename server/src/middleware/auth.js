import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Authenticate JWT token and set req.user
export const isAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_jobizza_12345');

      // Get user from the token, exclude password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

// Alias for compatibility
export const protect = isAuth;

// Restrict to admins (must be role === admin AND status === accepted)
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin' && req.user.status === 'accepted') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as an accepted admin' });
  }
};

// Alias for compatibility
export const admin = isAdmin;

// Restrict to Main Admins (must be role === admin AND status === accepted AND isMainAdmin === true)
export const isMainAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin' && req.user.status === 'accepted' && req.user.isMainAdmin === true) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as a main admin' });
  }
};
