const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gym_db');
    
    const adminExists = await User.findOne({ email: 'admin@titanfit.com' });
    if (adminExists) {
      console.log('Admin user pehle se exist karta hai!');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    await User.create({
      name: 'System Admin',
      email: 'admin@titanfit.com',
      password: hashedPassword,
      role: 'admin',
      activePlan: 'VIP Elite',
      enrolledProgram: 'Admin Panel Access'
    });

    console.log('✅ Admin user successfully create ho gaya!');
    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();