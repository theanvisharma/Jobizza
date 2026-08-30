import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  position: {
    type: String,
    required: [true, 'Please add a position/designation'],
  },
  role: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  linkedinUrl: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
export default TeamMember;
