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

async function getLoginInfo() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      console.log('\n🎉 ADMIN LOGIN CREDENTIALS');
      console.log('═══════════════════════════════════════');
      console.log('🔑 Leanifi ID: ADMIN001');
      console.log('🔐 Password: admin123');
      console.log('👤 Name:', admin.name);
      console.log('🔒 Role: Administrator');
      console.log('═══════════════════════════════════════');
      console.log('\n🌐 Access the app at: http://localhost:3000');
      console.log('📱 Login URL: http://localhost:3000/login');
      console.log('\n📋 Steps to login:');
      console.log('1. Start the development server: npm run dev');
      console.log('2. Open http://localhost:3000 in your browser');
      console.log('3. You will be redirected to the login page');
      console.log('4. Enter Leanifi ID: ADMIN001');
      console.log('5. Enter Password: admin123');
      console.log('6. Click "Sign In"');
      console.log('7. You will be redirected to the admin dashboard');
    } else {
      console.log('❌ No admin user found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

getLoginInfo();
