const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const User = require('./models/User');
const Environment = require('./models/Environment');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/green-campus');
  console.log('MongoDB Connected for seeding...');
};

const seed = async () => {
  try {
    await connectDB();

    // Remove existing admin
    await User.deleteMany({});
    const hashedPassword = await bcrypt.hash('varshini123', 10);
    const admin = await User.create({
    name: 'Varshini',
    email: 'varshini.bt23@bitsathy.ac.in',
    password: 'varshini123',
    role: 'admin'
  });
    console.log('✅ Admin created:', admin.email, '| Password: varshini123');

    // Sample environment data
    await Environment.deleteMany({});
    const BLOCKS = ['Academic Block', 'Laboratory Block', 'Administrative Block', 'Hostel Block', 'Library Block'];
    const MONTHS = ['January','February','March','April','May','June'];
    const sampleData = [];

    BLOCKS.forEach(block => {
      MONTHS.forEach(month => {
        sampleData.push({
          blockName:     block,
          month,
          year:          2025,
          energyUsed:    Math.floor(Math.random() * 1200) + 300,
          waterUsed:     Math.floor(Math.random() * 25000) + 5000,
          totalWaste:    Math.floor(Math.random() * 200) + 50,
          recycledWaste: Math.floor(Math.random() * 100) + 20,
          treesPlanted:  Math.floor(Math.random() * 10)
        });
      });
    });

    for (const d of sampleData) {
      const rec = new Environment(d);
      await rec.save();
    }
    console.log(`✅ ${sampleData.length} sample environment records created`);
    console.log('\n🔑 Login Credentials:');
    console.log('   Email:    varshini.bt23@bitsathy.ac.in');
    console.log('   Password: varshini123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
