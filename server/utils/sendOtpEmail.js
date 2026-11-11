const { Resend } = require('resend');

const sendOtpEmail = async (email, name, otp) => {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY Missing!');
      return { success: false, error: 'RESEND_API_KEY is not defined' };
    }

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: 'TitanFit Gym <onboarding@resend.dev>',
      to: [email],
      subject: 'TitanFit — Verify Your Email OTP 🏋️‍♂️',
      html: `<h2>OTP: ${otp}</h2>`
    });

    if (error) {
      console.error('Resend API Returned Error:', error);
      return { success: false, error: error.message || error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Resend Exception:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = sendOtpEmail;