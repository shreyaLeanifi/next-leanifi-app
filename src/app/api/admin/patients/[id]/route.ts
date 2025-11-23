import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken, getTokenFromCookies } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const patient = await User.findById(params.id).select('-password');
    
    if (!patient || patient.role !== 'patient') {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      patient: {
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
      }
    });
  } catch (error) {
    console.error('Get patient error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      isActive,
    } = await request.json();

    const patient = await User.findById(params.id);
    
    if (!patient || patient.role !== 'patient') {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    // Update patient fields
    if (name !== undefined) patient.name = name;
    if (age !== undefined) patient.age = age;
    if (gender !== undefined) patient.gender = gender;
    if (weight !== undefined) patient.weight = weight;
    if (treatmentStartDate !== undefined) patient.treatmentStartDate = new Date(treatmentStartDate);
    if (allergies !== undefined) patient.allergies = allergies;
    if (medicalHistory !== undefined) patient.medicalHistory = medicalHistory;
    if (familyHistory !== undefined) patient.familyHistory = familyHistory;
    if (medications !== undefined) patient.medications = medications;
    if (socialHistory !== undefined) patient.socialHistory = socialHistory;
    if (isActive !== undefined) patient.isActive = isActive;

    await patient.save();

    return NextResponse.json({
      success: true,
      patient: {
        id: patient._id.toString(),
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
        isActive: patient.isActive,
      }
    });
  } catch (error) {
    console.error('Update patient error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const patient = await User.findById(params.id);
    
    if (!patient || patient.role !== 'patient') {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    await User.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    console.error('Delete patient error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

