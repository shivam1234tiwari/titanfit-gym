const { Resend } = require('resend');

const sendOtpEmail = async (email, name, otp) => {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return { success: false, error: 'RESEND_API_KEY is not defined in environment variables' };
    }

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: 'TitanFit Gym <onboarding@resend.dev>',
      to: [email],
      subject: 'TitanFit — Verify Your Email OTP 🏋️‍♂️',
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
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

module.exports = sendOtpEmail;