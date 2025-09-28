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

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    console.log('\n📊 All users in database:');
    console.log('═══════════════════════════════════════');
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. Leanifi ID: ${user.leanifiId}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Active: ${user.isActive}`);
        console.log('   ───────────────────────────────────────');
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkUsers();
