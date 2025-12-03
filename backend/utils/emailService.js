import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send OTP email
export const sendOTPEmail = async (email, name, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Worksera" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification - Worksera',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              color: #4F46E5;
              margin-bottom: 30px;
            }
            .otp-box {
              background-color: #4F46E5;
              color: white;
              font-size: 32px;
              font-weight: bold;
              text-align: center;
              padding: 20px;
              border-radius: 8px;
              letter-spacing: 8px;
              margin: 30px 0;
            }
            .footer {
              text-align: center;
              color: #666;
              font-size: 14px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
            .warning {
              background-color: #FEF3C7;
              border-left: 4px solid #F59E0B;
              padding: 12px;
              margin: 20px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Worksera!</h1>
            </div>
            
            <p>Hello <strong>${name}</strong>,</p>
            
            <p>Thank you for registering with Worksera. To complete your registration, please verify your email address using the One-Time Password (OTP) below:</p>
            
            <div class="otp-box">
              ${otp}
            </div>
            
            <div class="warning">
              <strong>⚠️ Important:</strong> This OTP will expire in 10 minutes.
            </div>
            
            <p>If you didn't request this verification, please ignore this email.</p>
            
            <div class="footer">
              <p>Best regards,<br><strong>The Worksera Team</strong></p>
              <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Hello ${name},\n\nThank you for registering with Worksera. Your OTP for email verification is: ${otp}\n\nThis OTP will expire in 10 minutes.\n\nIf you didn't request this verification, please ignore this email.\n\nBest regards,\nThe Worksera Team`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error('Failed to send verification email');
  }
};

export default { sendOTPEmail };
