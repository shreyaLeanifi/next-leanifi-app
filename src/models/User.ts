import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  leanifiId: string;
  password: string;
  role: 'admin' | 'clinician' | 'patient';
  name: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  treatmentStartDate?: Date;
  allergies?: string;
  medicalHistory?: string;
  familyHistory?: string;
  medications?: string;
  socialHistory?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  leanifiId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'clinician', 'patient'],
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    min: 0,
    max: 120
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  weight: {
    type: Number,
    min: 0
  },
  treatmentStartDate: {
    type: Date
  },
  allergies: {
    type: String,
    trim: true
  },
  medicalHistory: {
    type: String,
    trim: true
  },
  familyHistory: {
    type: String,
    trim: true
  },
  medications: {
    type: String,
    trim: true
  },
  socialHistory: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
