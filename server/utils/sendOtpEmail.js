const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtpEmail = async (email, name, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'TitanFit Gym <onboarding@resend.dev>', // Free tier sender
      to: [email],
      subject: 'TitanFit — Verify Your Email OTP 🏋️‍♂️',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #0d0d0d; color: #ffffff;">
          <h2 style="color: #ff3b30; text-align: center;">TITANFIT GYM</h2>
          <p style="font-size: 16px;">Hello <strong>${name || 'Athlete'}</strong>,</p>
          <p style="font-size: 14px; color: #cccccc;">Your One-Time Password (OTP) for account verification is:</p>
          <div style="text-align: center; margin: 25px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ffffff; background: #222222; padding: 10px 20px; border-radius: 6px; border: 1px solid #ff3b30;">${otp}</span>
          </div>
          <p style="font-size: 12px; color: #888888; text-align: center;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
        </div>
      `
    });

    if (error) {
      console.error('Resend Email Error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Send OTP Execution Error:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = sendOtpEmail;