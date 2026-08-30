import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create transporter
const smtpUser = process.env.EMAIL_USER || process.env.SMTP_USER;
const smtpPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

let transporter;

if (smtpUser && smtpPass) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
} else {
  // Mock transporter for development so that email OTP works without SMTP credentials
  console.log('Nodemailer: Email credentials not configured. Using mock mail sender.');
  transporter = {
    sendMail: async (options) => {
      console.log('\n=============================================');
      console.log('             MOCK EMAIL SENT                 ');
      console.log('=============================================');
      console.log(`  To:      ${options.to}`);
      console.log(`  Subject: ${options.subject}`);
      console.log('---------------------------------------------');
      console.log(options.text || options.html);
      console.log('=============================================\n');
      return { messageId: 'mock-id-12345' };
    }
  };
}

export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@jobizzatech.com',
    to: email,
    subject: 'Jobizza Tech - Email OTP Verification',
    text: `Your OTP (One Time Password) is: ${otp}. It will expire in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #04486e;">Jobizza Tech Verification Code</h2>
        <p>Please use the following One-Time Password (OTP) to log in to your account. This code is valid for 10 minutes.</p>
        <div style="font-size: 24px; font-weight: bold; background: #f4f8fa; padding: 15px; text-align: center; border-radius: 4px; color: #046eac; letter-spacing: 4px;">
          ${otp}
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #777;">If you did not request this verification, please ignore this email.</p>
      </div>
    `
  };
  return await transporter.sendMail(mailOptions);
};

export const sendStatusUpdateEmail = async (email, status) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@jobizzatech.com',
    to: email,
    subject: `Jobizza Tech - Account Status: ${status.toUpperCase()}`,
    text: `Your account registration status has been updated to: ${status}.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #04486e;">Account Registration Update</h2>
        <p>Your membership application has been reviewed. The status of your account is now:</p>
        <div style="font-size: 20px; font-weight: bold; background: #f4f8fa; padding: 15px; text-align: center; border-radius: 4px; color: ${status === 'accepted' ? '#2e7d32' : '#c62828'};">
          ${status.toUpperCase()}
        </div>
        <p style="margin-top: 20px;">
          ${status === 'accepted' 
            ? 'Congratulations! You now have full access to our premium digital services and IT staffing network. Please log in to complete any remaining steps.' 
            : 'We regret to inform you that your request has been declined at this time. Please contact support for more details.'}
        </p>
      </div>
    `
  };
  return await transporter.sendMail(mailOptions);
};
