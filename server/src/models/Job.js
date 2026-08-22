import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a job title'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Please specify the department/category'],
      enum: ['Engineering', 'Cloud', 'HR/Staffing', 'UI/UX'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
      default: 'Pune',
    },
    type: {
      type: String,
      required: [true, 'Please specify contract/employment type'],
      enum: ['Full-time', 'Contract', 'Part-time', 'Remote', 'Hybrid'],
      default: 'Full-time',
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    requirements: {
      type: [String],
      required: [true, 'Please add job requirements'],
    },
    benefits: {
      type: [String],
      default: [],
    },
    salaryRange: {
      type: String,
      default: 'Not Disclosed',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;
