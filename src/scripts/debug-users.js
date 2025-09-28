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

async function debugUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users and show their exact role values
    const users = await User.find({});
    console.log('\n📊 All users in database:');
    console.log('═══════════════════════════════════════');
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Leanifi ID: ${user.leanifiId}`);
      console.log(`   Role: "${user.role}" (length: ${user.role?.length})`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Active: ${user.isActive}`);
      console.log('   ───────────────────────────────────────');
    });

    // Try different role variations
    const adminLower = await User.findOne({ role: 'admin' });
    const adminUpper = await User.findOne({ role: 'Admin' });
    const adminCapital = await User.findOne({ role: 'ADMIN' });
    
    console.log('\n🔍 Role search results:');
    console.log('admin (lowercase):', adminLower ? 'Found' : 'Not found');
    console.log('Admin (capitalized):', adminUpper ? 'Found' : 'Not found');
    console.log('ADMIN (uppercase):', adminCapital ? 'Found' : 'Not found');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

debugUsers();
