require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// User schema
const UserSchema = new mongoose.Schema({
  leanifiId: String,
  role: String,
  name: String,
  isActive: Boolean
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function showCredentials() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      console.log('\n🎉 Admin user found!');
      console.log('═══════════════════════════════════════');
      console.log('📋 LOGIN CREDENTIALS:');
      console.log('═══════════════════════════════════════');
      console.log('🔑 Leanifi ID: ADMIN001');
      console.log('🔐 Password: admin123');
      console.log('👤 Name:', admin.name);
      console.log('🔒 Role: Administrator');
      console.log('═══════════════════════════════════════');
      console.log('\n🌐 Access the app at: http://localhost:3000');
      console.log('📱 Login URL: http://localhost:3000/login');
    } else {
      console.log('❌ No admin user found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

showCredentials();
