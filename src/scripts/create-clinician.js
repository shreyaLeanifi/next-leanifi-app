require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  leanifiId: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'clinician', 'patient'], required: true },
  name: { type: String, required: true, trim: true },
  age: Number,
  gender: String,
  weight: Number,
  treatmentStartDate: Date,
  allergies: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createClinician() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ leanifiId: 'CLIN001' });
    if (existing) {
      console.log('Clinician already exists:', existing.leanifiId);
      return;
    }

    const hashed = await bcrypt.hash('nurse123', 12);
    const clinician = new User({
      leanifiId: 'CLIN001',
      password: hashed,
      role: 'clinician',
      name: 'Nurse One',
      isActive: true,
    });
    await clinician.save();
    console.log('Clinician created.');
    console.log('Login with Leanifi ID: CLIN001');
    console.log('Password: nurse123');
  } catch (e) {
    console.error('Error creating clinician:', e);
  } finally {
    await mongoose.disconnect();
  }
}

createClinician();




