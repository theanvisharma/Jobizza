import express from 'express';
import TeamMember from '../models/TeamMember.js';
import { isAuth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
router.get('/', async (req, res) => {
  try {
    const team = await TeamMember.find({}).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: team.length, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Add a new team member
// @route   POST /api/team
// @access  Private/Admin
router.post('/', isAuth, isAdmin, async (req, res) => {
  const { name, position, role, image, linkedinUrl, order } = req.body;
  const finalPosition = position || role;

  if (!name || !finalPosition) {
    return res.status(400).json({ success: false, message: 'Please provide name and position' });
  }

  try {
    const member = new TeamMember({
      name,
      position: finalPosition,
      role: role || finalPosition,
      image: image || '',
      linkedinUrl: linkedinUrl || '',
      order: order || 0,
    });

    await member.save();
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update team member details
// @route   PUT /api/team/:id
// @access  Private/Admin
router.put('/:id', isAuth, isAdmin, async (req, res) => {
  const { name, position, role, image, linkedinUrl, order } = req.body;

  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    if (name) member.name = name;
    if (position) member.position = position;
    if (role) member.role = role;
    if (image !== undefined) member.image = image;
    if (linkedinUrl !== undefined) member.linkedinUrl = linkedinUrl;
    if (order !== undefined) member.order = order;

    await member.save();
    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete a team member
// @route   DELETE /api/team/:id
// @access  Private/Admin
router.delete('/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    await member.deleteOne();
    res.json({ success: true, message: 'Team member removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
