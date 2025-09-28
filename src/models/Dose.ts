import mongoose, { Document, Schema } from 'mongoose';

export interface IDose extends Document {
  patientId: string;
  date: Date;
  time: Date;
  dosage: '0.25mg' | '0.5mg' | '1mg' | '1.7mg' | '2.4mg';
  injectionSite: 'left_arm' | 'right_arm' | 'left_thigh' | 'right_thigh' | 'left_abdomen' | 'right_abdomen';
  status: 'administered' | 'missed' | 'refused';
  batchNumber?: string;
  clinicianId?: string;
  clinicianInitials?: string;
  sideEffects: string[];
  sideEffectsNotes?: string;
  photoUrl?: string;
  notes?: string;
  isPatientLogged: boolean;
  missedReason?: 'forgot' | 'unwell' | 'no_supply' | 'other';
  missedReasonNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DoseSchema = new Schema<IDose>({
  patientId: {
    type: String,
    required: true,
    ref: 'User'
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: Date,
    required: true
  },
  dosage: {
    type: String,
    enum: ['0.25mg', '0.5mg', '1mg', '1.7mg', '2.4mg'],
    required: true
  },
  injectionSite: {
    type: String,
    enum: ['left_arm', 'right_arm', 'left_thigh', 'right_thigh', 'left_abdomen', 'right_abdomen'],
    required: true
  },
  status: {
    type: String,
    enum: ['administered', 'missed', 'refused'],
    required: true
  },
  batchNumber: {
    type: String,
    trim: true
  },
  clinicianId: {
    type: String,
    ref: 'User'
  },
  clinicianInitials: {
    type: String,
    trim: true
  },
  sideEffects: [{
    type: String,
    trim: true
  }],
  sideEffectsNotes: {
    type: String,
    trim: true
  },
  photoUrl: {
    type: String
  },
  notes: {
    type: String,
    trim: true
  },
  isPatientLogged: {
    type: Boolean,
    default: false
  },
  missedReason: {
    type: String,
    enum: ['forgot', 'unwell', 'no_supply', 'other']
  },
  missedReasonNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Dose || mongoose.model<IDose>('Dose', DoseSchema);
