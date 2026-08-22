import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add your work email'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please add your phone number'],
    },
    serviceRequired: {
      type: String,
      required: [true, 'Please specify the service you require'],
      enum: [
        'Workforce & Staffing Solutions',
        'Web & Mobile App Development',
        'Digital Transformation & Cloud',
        'Custom Enterprise Software',
      ],
    },
    projectDetails: {
      type: String,
      required: [true, 'Please provide some project details or message'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Contacted', 'Resolved'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
