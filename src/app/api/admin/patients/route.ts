import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, verifyToken, getTokenFromCookies } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const token = getTokenFromCookies(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role?.toLowerCase() !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Fetch all patients
    const patients = await User.find({ role: 'patient' }).select('-password');
    
    return NextResponse.json({
      success: true,
      patients: patients.map(patient => ({
        id: patient._id.toString(),
        leanifiId: patient.leanifiId,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        weight: patient.weight,
        treatmentStartDate: patient.treatmentStartDate,
        allergies: patient.allergies || '',
        medicalHistory: patient.medicalHistory || '',
        familyHistory: patient.familyHistory || '',
        medications: patient.medications || '',
        socialHistory: patient.socialHistory || '',
        isActive: patient.isActive,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt
      }))
    });
  } catch (error) {
    console.error('Fetch patients error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const token = getTokenFromCookies(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role?.toLowerCase() !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const {
      leanifiId,
      password,
      name,
      age,
      gender,
      weight,
      treatmentStartDate,
      allergies,
      medicalHistory,
      familyHistory,
      medications,
      socialHistory,
    } = await request.json();

    // Validate required fields
    if (!leanifiId || !password || !name || !age || !gender || !weight || !treatmentStartDate) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Check if Leanifi ID already exists
    const existingUser = await User.findOne({ leanifiId });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Leanifi ID already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create patient
    const patientData: {
      leanifiId: string;
      password: string;
      role: string;
      name: string;
      age: number;
      gender: string;
      weight: number;
      treatmentStartDate: Date;
      isActive: boolean;
      allergies?: string;
      medicalHistory?: string;
      familyHistory?: string;
      medications?: string;
      socialHistory?: string;
    } = {
      leanifiId,
      password: hashedPassword,
      role: 'patient',
      name,
      age,
      gender,
      weight,
      treatmentStartDate: new Date(treatmentStartDate),
      isActive: true,
    };

    // Add optional fields (explicitly set even if empty to ensure they're saved to DB)
    patientData.allergies = allergies ?? '';
    patientData.medicalHistory = medicalHistory ?? '';
    patientData.familyHistory = familyHistory ?? '';
    patientData.medications = medications ?? '';
    patientData.socialHistory = socialHistory ?? '';

    const patient = new User(patientData);

    await patient.save();

    return NextResponse.json({
      success: true,
      patient: {
        id: patient._id,
        leanifiId: patient.leanifiId,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        weight: patient.weight,
        treatmentStartDate: patient.treatmentStartDate,
        allergies: patient.allergies,
        medicalHistory: patient.medicalHistory,
        familyHistory: patient.familyHistory,
        medications: patient.medications,
        socialHistory: patient.socialHistory,
      },
    });
  } catch (error) {
    console.error('Create patient error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
