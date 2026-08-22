import express from 'express';
import nodemailer from 'nodemailer';
import Contact from '../models/Contact.js';

const router = express.Router();

// Helper to configure Nodemailer transporter
const getTransporter = async () => {
  const hasSMTPAuth = process.env.SMTP_USER && process.env.SMTP_PASS;

  if (hasSMTPAuth) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: parseInt(process.env.SMTP_PORT || '2525'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback to auto-generated Ethereal testing account or mock logger
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log(`SMTP Credentials missing. Initialized Ethereal test account: ${testAccount.user}`);
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (error) {
    console.log('SMTP Ethereal setup failed. Initialized console fallback emailer.');
    return {
      sendMail: async (options) => {
        console.log('\n✉️ --- FALLBACK CONSOLE EMAIL ---');
        console.log(`From: ${options.from}`);
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Text Body:\n${options.text}`);
        console.log('---------------------------------\n');
        return { messageId: 'console-mock-msg-id' };
      },
    };
  }
};

// @desc    Submit a contact lead form
// @route   POST /api/contact
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, phone, serviceRequired, projectDetails } = req.body;

  try {
    // 1. Save contact in database
    const lead = await Contact.create({
      name,
      email,
      phone,
      serviceRequired,
      projectDetails,
    });

    // 2. Setup email notification
    const transporter = await getTransporter();
    const mailOptions = {
      from: process.env.SMTP_FROM || 'inquiries@jobizza.com',
      to: 'sales@jobizza.com', // Internal inbox
      subject: `New Lead Captured: ${serviceRequired} - ${name}`,
      text: `
        You have captured a new customer inquiry on Jobizza Tech.

        Lead Details:
        - Name: ${name}
        - Email: ${email}
        - Phone: ${phone}
        - Service Required: ${serviceRequired}
        
        Project Description / Message:
        ${projectDetails}

        This lead has been saved in the database (Ref: ${lead._id}).
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Lead notification sent. Msg ID: ${info.messageId}`);

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully! Our staffing experts will reach out shortly.',
      data: lead,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
