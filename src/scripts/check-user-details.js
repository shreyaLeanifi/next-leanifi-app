require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema
const UserSchema = new mongoose.Schema({
  leanifiId: String,
  password: String,
  role: String,
  name: String,
  isActive: Boolean
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function checkUserDetails() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find user by leanifiId
    const user = await User.findOne({ leanifiId: 'ADMIN001' });
    
    if (!user) {
      console.log('❌ User ADMIN001 not found in database');
      return;
    }

    console.log('\n🔍 User Details:');
    console.log('═══════════════════════════════════════');
    console.log('ID:', user._id);
    console.log('Leanifi ID:', user.leanifiId);
    console.log('Name:', user.name);
    console.log('Role:', user.role);
    console.log('Active:', user.isActive);
    console.log('Password Hash:', user.password ? 'Set' : 'Not set');
    console.log('Password Length:', user.password?.length || 0);

    // Test password verification
    const testPassword = 'admin123';
    const isValidPassword = await bcrypt.compare(testPassword, user.password);
    console.log('Password "admin123" valid:', isValidPassword);

    // Test with different passwords
    const testPasswords = ['admin123', 'Admin123', 'ADMIN123', 'password'];
    for (const pwd of testPasswords) {
      const isValid = await bcrypt.compare(pwd, user.password);
      console.log(`Password "${pwd}" valid:`, isValid);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkUserDetails();
