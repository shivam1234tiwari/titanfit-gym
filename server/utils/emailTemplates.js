// Welcome Email Template
exports.welcomeEmailTemplate = (userName) => `
  <div style="font-family: Arial, sans-serif; background-color: #020617; color: #f8fafc; padding: 20px; border-radius: 10px;">
    <h2 style="color: #f59e0b;">Welcome to TitanFit, ${userName}! 💪</h2>
    <p>We are thrilled to have you join our fitness community.</p>
    <p>You can now log in, track your daily workouts, view customized diet plans, and check in at the reception using your digital QR pass.</p>
    <br/>
    <p style="color: #94a3b8; font-size: 12px;">TitanFit Gym Management Team</p>
  </div>
`;

// Plan Activation Email Template
exports.planActivatedTemplate = (userName, planName) => `
  <div style="font-family: Arial, sans-serif; background-color: #020617; color: #f8fafc; padding: 20px; border-radius: 10px;">
    <h2 style="color: #10b981;">Membership Activated! 🎉</h2>
    <p>Hi ${userName},</p>
    <p>Your subscription to the <strong style="color: #f59e0b;">${planName}</strong> plan is now active.</p>
    <p>Enjoy full access to all gym floor privileges and facilities associated with your tier.</p>
    <br/>
    <p style="color: #94a3b8; font-size: 12px;">TitanFit Gym Management Team</p>
  </div>
`;
/**
 * Template for Trainer Booking Request / Confirmation Email
 */
exports.bookingConfirmedTemplate = (userName, trainerName, slotDate, timeSlot) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #ffffff; border-radius: 12px;">
      <h2 style="color: #f59e0b; text-align: center; margin-bottom: 5px;">TITANFIT GYM</h2>
      <p style="text-align: center; color: #94a3b8; font-size: 14px; margin-top: 0;">Trainer Session Booking Confirmation</p>
      
      <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
      
      <p>Hello <strong>${userName}</strong>,</p>
      <p>Your personal training session request has been successfully submitted!</p>
      
      <div style="background-color: #1e293b; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
        <p style="margin: 5px 0;">🏋️‍♂️ <strong>Assigned Trainer:</strong> ${trainerName}</p>
        <p style="margin: 5px 0;">📅 <strong>Date:</strong> ${slotDate}</p>
        <p style="margin: 5px 0;">⏰ <strong>Time Slot:</strong> ${timeSlot}</p>
        <p style="margin: 5px 0;">📌 <strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">Pending Confirmation</span></p>
      </div>

      <p style="font-size: 13px; color: #cbd5e1;">Our team and trainer will review your slot. You can check real-time updates inside your TitanFit member dashboard.</p>
      
      <br/>
      <p style="font-size: 12px; color: #64748b; text-align: center;">Stay consistent, push your limits! 🏋️‍♂️💪<br/>— Team TitanFit Gym</p>
    </div>
  `;
};