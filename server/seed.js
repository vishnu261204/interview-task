const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'admin@example.com' });
    
    if (!existingUser) {
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      });
      console.log('✅ Test user created successfully!');
      console.log('📧 Email: admin@example.com');
      console.log('🔑 Password: password123');
    } else {
      console.log('⚠️ Test user already exists');
      console.log('📧 Email: admin@example.com');
      console.log('🔑 Password: password123');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createTestUser();