const Expert = require('../models/Expert');

// 1. Get Dynamic Pie Chart Stats
exports.getPieChartStats = async (req, res) => {
  try {
    const { timeRange = 'week' } = req.query;

    let stats = [];

    if (timeRange === 'week') {
      stats = [
        { name: 'Strength Training', value: 38, color: '#f59e0b' },
        { name: 'Yoga & Mobility', value: 24, color: '#10b981' },
        { name: 'Cardio & HIIT', value: 22, color: '#3b82f6' },
        { name: 'Senior Wellness (60+)', value: 16, color: '#8b5cf6' }
      ];
    } else if (timeRange === 'month') {
      stats = [
        { name: 'Strength Training', value: 45, color: '#f59e0b' },
        { name: 'Yoga & Mobility', value: 20, color: '#10b981' },
        { name: 'Cardio & HIIT', value: 25, color: '#3b82f6' },
        { name: 'Senior Wellness (60+)', value: 10, color: '#8b5cf6' }
      ];
    } else {
      // allTime
      stats = [
        { name: 'Strength Training', value: 50, color: '#f59e0b' },
        { name: 'Yoga & Mobility', value: 18, color: '#10b981' },
        { name: 'Cardio & HIIT', value: 17, color: '#3b82f6' },
        { name: 'Senior Wellness (60+)', value: 15, color: '#8b5cf6' }
      ];
    }

    return res.json({
      success: true,
      timeRange,
      data: stats
    });
  } catch (error) {
    console.error("Pie Chart Controller Error:", error);
    return res.status(500).json({ success: false, message: "Error fetching pie chart data" });
  }
};

// 2. Get All Experts
exports.getAllExperts = async (req, res) => {
  try {
    let experts = await Expert.find().sort({ createdAt: -1 });

    // Seed fallback agar DB empty ho
    if (!experts || experts.length === 0) {
      experts = [
        {
          _id: 'default-1',
          name: 'Marcus Vance',
          role: 'Head Strength & Conditioning',
          exp: '8+ Years Exp.',
          bio: 'Specializes in max strength progression, powerlifting, and muscle hypertrophy techniques.',
          image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=600'
        },
        {
          _id: 'default-2',
          name: 'Elena Rostova',
          role: 'HIIT & Mobility Specialist',
          exp: '6+ Years Exp.',
          bio: 'Focuses on active joint mobility, cardio endurance, and specialized routines for 60+ seniors.',
          image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=600'
        },
        {
          _id: 'default-3',
          name: 'David Miller',
          role: 'Bodybuilding & Powerlifting Coach',
          exp: '10+ Years Exp.',
          bio: 'Combines science-backed powerlifting techniques with structured nutrition planning.',
          image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=600'
        }
      ];
    }

    return res.json({ success: true, experts });
  } catch (error) {
    console.error("Get Experts Controller Error:", error);
    return res.status(500).json({ success: false, message: 'Failed to fetch experts from DB' });
  }
};

// 3. Create / Add New Expert
exports.createExpert = async (req, res) => {
  try {
    const { name, role, exp, bio, image } = req.body;

    if (!name || !role) {
      return res.status(400).json({ success: false, message: 'Name and Role are required' });
    }

    const newExpert = new Expert({
      name,
      role,
      exp: exp || '1+ Year',
      bio: bio || 'Certified fitness coach at TITANFIT.',
      image: image || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=600'
    });

    await newExpert.save();
    return res.status(201).json({ success: true, expert: newExpert });
  } catch (error) {
    console.error("Create Expert Controller Error:", error);
    return res.status(500).json({ success: false, message: 'Error saving expert to DB' });
  }
};

// 4. Delete Expert
exports.deleteExpert = async (req, res) => {
  try {
    const { id } = req.params;
    await Expert.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Expert removed successfully' });
  } catch (error) {
    console.error("Delete Expert Controller Error:", error);
    return res.status(500).json({ success: false, message: 'Failed to delete expert' });
  }
};