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