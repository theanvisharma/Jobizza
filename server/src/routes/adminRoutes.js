import express from 'express';
import User from '../models/User.js';
import { isAuth, isAdmin, isMainAdmin } from '../middleware/auth.js';
import { sendStatusUpdateEmail } from '../config/nodemailer.js';

const router = express.Router();

// @desc    List all users with search and filtering
// @route   GET /api/admin/members
// @access  Private/Admin
router.get('/members', isAuth, isAdmin, async (req, res) => {
  const { status, role, q } = req.query;

  try {
    const filter = {};

    if (status) {
      filter.status = status;
    }
    
    if (role) {
      filter.role = role;
    }

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ];
    }

    const members = await User.find(filter).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Approve/Reject pending member accounts
// @route   PATCH /api/admin/members/:id/status
// @access  Private/Admin
router.patch('/members/:id/status', isAuth, isAdmin, async (req, res) => {
  const { status } = req.body;
  const memberId = req.params.id;

  if (!status || !['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid status (accepted or rejected)' });
  }

  try {
    const user = await User.findById(memberId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Do not allow changing main admin's status
    if (user.isMainAdmin) {
      return res.status(400).json({ success: false, message: 'Main Admin status cannot be altered' });
    }

    user.status = status;
    await user.save();

    // Send status update notification email
    try {
      await sendStatusUpdateEmail(user.email, status);
    } catch (mailError) {
      console.error(`Error sending email to ${user.email}:`, mailError);
    }

    res.json({
      success: true,
      message: `Member status updated to ${status} successfully.`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Promote/demote members to/from admin roles
// @route   PATCH /api/admin/members/:id/role
// @access  Private/MainAdmin
router.patch('/members/:id/role', isAuth, isMainAdmin, async (req, res) => {
  const { role } = req.body;
  const memberId = req.params.id;

  if (!role || !['member', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid role (member or admin)' });
  }

  try {
    const user = await User.findById(memberId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Prevent demoting another main admin or self
    if (user.isMainAdmin) {
      return res.status(400).json({ success: false, message: 'Main Admin role cannot be altered' });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `Member role updated to ${role} successfully.`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
