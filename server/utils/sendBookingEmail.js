const nodemailer = require('nodemailer');

const sendBookingEmail = async (userEmail, userName, trainerName, slotDate, timeSlot) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS
      }
    });

    const { bookingConfirmedTemplate } = require('./emailTemplates');

    const mailOptions = {
      from: `"TitanFit Gym" <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: 'Trainer Session Booking Received — TitanFit Gym 🏋️‍♂️',
      html: bookingConfirmedTemplate(userName, trainerName, slotDate, timeSlot)
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (error) {
    console.error('Booking Email Delivery Error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendBookingEmail;