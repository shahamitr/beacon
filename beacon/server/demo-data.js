// Demo data script for MongoDB
const mongoose = require('mongoose');
const User = require('./models/User');
const Website = require('./models/Website');
const Scan = require('./models/Scan');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/beacon';

async function seed() {
  await mongoose.connect(MONGO_URI);
  await User.deleteMany({});
  await Website.deleteMany({});
  await Scan.deleteMany({});

  const user = await User.create({
    email: 'demo@beacon.com',
    password: 'password', // Assume pre-hashed or use plain for demo
    name: 'Demo User',
  });

  const website1 = await Website.create({
    user: user._id,
    name: 'Demo Site 1',
    url: 'https://example1.com',
  });
  const website2 = await Website.create({
    user: user._id,
    name: 'Demo Site 2',
    url: 'https://example2.com',
  });

  await Scan.create([
    {
      website: website1._id,
      status: 'completed',
      completedAt: new Date(),
      result: { issues: [
        { id: 1, description: 'Image missing alt', impact: 'serious' },
        { id: 2, description: 'Low contrast text', impact: 'moderate' },
      ] },
    },
    {
      website: website1._id,
      status: 'completed',
      completedAt: new Date(Date.now() - 86400000),
      result: { issues: [
        { id: 3, description: 'Button missing label', impact: 'serious' },
      ] },
    },
    {
      website: website2._id,
      status: 'completed',
      completedAt: new Date(),
      result: { issues: [
        { id: 4, description: 'Form field not labeled', impact: 'moderate' },
      ] },
    },
  ]);

  console.log('Demo data seeded.');
  process.exit();
}

seed();
