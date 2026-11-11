const nodemailer = require('nodemailer');

const sendOtpEmail = async (email, name, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,      
        pass: process.env.GMAIL_APP_PASS   
      }
    });

    const mailOptions = {
      from: `"TitanFit Gym" <${process.env.GMAIL_USER}>`,
      to: email, 
      subject: 'TitanFit Gym — Verify Your Email OTP 🏋️‍♂️',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #ffffff; border-radius: 12px;">
          <h2 style="color: #f59e0b; text-align: center;">TITANFIT GYM</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your OTP for email verification is:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px; background: #1e293b; padding: 10px 24px; border-radius: 8px; color: #f59e0b;">${otp}</span>
          </div>
          <p style="font-size: 12px; color: #94a3b8;">This OTP will expire in 10 minutes.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (err) {
    console.error('Nodemailer Error:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = sendOtpEmail;