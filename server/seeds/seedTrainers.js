const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Trainer = require('../models/Trainer');

dotenv.config();

const sampleTrainers = [
  {
    name: 'Elena Rostova',
    role: 'HIIT & Mobility Specialist',
    specialization: 'HIIT Training & Joint Mobility', // Schema Required Field
    experienceYears: 6,                              // Schema Required Field
    rating: 5.0,
    about: 'Elena blends explosive cardiovascular conditioning with joint mobility routines to ensure fat loss while maintaining joint longevity.',
    specialties: ['HIIT Training', 'Mobility & Stretching', 'Fat Loss'],
    certifications: ['CrossFit L2', 'Yoga Alliance RYT-500'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Marcus Vance',
    role: 'Head Strength & Conditioning',
    specialization: 'Powerlifting & Hypertrophy',    // Schema Required Field
    experienceYears: 8,                              // Schema Required Field
    rating: 4.9,
    about: 'Marcus has trained elite athletes and bodybuilders for over 8 years. He specializes in strength progression, powerlifting, and hypertrophy.',
    specialties: ['Powerlifting', 'Hypertrophy', 'Injury Prevention'],
    certifications: ['CSCS Certified', 'Olympic Lifting'],
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Vikram Singh',
    role: 'Fat Loss & Endurance Coach',
    specialization: 'Functional Training & Fat Loss', // Schema Required Field
    experienceYears: 5,                              // Schema Required Field
    rating: 4.9,
    about: 'Vikram specializes in body re-composition, metabolic conditioning, and endurance development through high-intensity circuit training.',
    specialties: ['TRX Suspension', 'Metabolic Conditioning', 'Calisthenics'],
    certifications: ['ISSA Strength Coach', 'TRX Specialist'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Trainer.deleteMany({});
    await Trainer.insertMany(sampleTrainers);
    console.log('✅ Trainer data successfully seeded!');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();