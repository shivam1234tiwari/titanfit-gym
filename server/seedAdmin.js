const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function runSeedAdmin() {
  try {
    // Uses MONGO_URI from your .env file
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGO_URI is missing in your .env file!');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    const email = 'admin@titanfit.com';
    const rawPassword = 'AdminPass16';

    // 1. Password Hash Generate Karein
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    // 2. Duplicate accounts cleanup karein
    const accounts = await usersCollection.find({ email }).toArray();
    console.log(`Found ${accounts.length} account(s) matching ${email}`);

    if (accounts.length > 1) {
      const keepId = accounts[0]._id;
      await usersCollection.deleteMany({
        email,
        _id: { $ne: keepId }
      });
      console.log('🗑️ Removed duplicate admin documents.');
    }

    // 3. Directly force update role to "admin" and reset password
    const result = await usersCollection.updateOne(
      { email },
      {
        $set: {
          name: 'Admin',
          email,
          password: hashedPassword,
          phoneNumber: '7654321098',
          role: 'admin' // Forced admin role assignment
        }
      },
      { upsert: true }
    );

    console.log('✅ Success! Role explicitly set to "admin" in MongoDB Atlas.');
    console.log('🔑 Email: admin@titanfit.com');
    console.log('🔑 Password: AdminPass16');
    console.log('🔑 Master PIN: admin123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Database update error:', err);
    process.exit(1);
  }
}

runSeedAdmin();