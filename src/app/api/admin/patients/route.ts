import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword, verifyToken, getTokenFromCookies } from '@/lib/auth';

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
    const patient = new User({
      leanifiId,
      password: hashedPassword,
      role: 'patient',
      name,
      age,
      gender,
      weight,
      treatmentStartDate: new Date(treatmentStartDate),
      allergies: allergies || '',
      isActive: true,
    });

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
