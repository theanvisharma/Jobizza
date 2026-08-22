import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Please reference a valid Job listing'],
    },
    name: {
      type: String,
      required: [true, 'Please add your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add your email address'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please add your phone number'],
    },
    linkedinProfile: {
      type: String,
      trim: true,
    },
    resumePath: {
      type: String,
      required: [true, 'Please upload a resume file'],
    },
    coverLetter: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewing', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;
