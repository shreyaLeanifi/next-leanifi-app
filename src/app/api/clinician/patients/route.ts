import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getTokenFromCookies, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = getTokenFromCookies(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Allow admin and clinician
    const role = decoded.role?.toLowerCase();
    if (!['admin', 'clinician'].includes(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const patients = await User.find({ role: 'patient' }).select('-password');

    return NextResponse.json({
      success: true,
      patients: patients.map((p) => ({
        id: p._id,
        leanifiId: p.leanifiId,
        name: p.name,
        age: p.age,
        gender: p.gender,
        weight: p.weight,
        treatmentStartDate: p.treatmentStartDate,
        allergies: p.allergies,
        isActive: p.isActive,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Clinician list patients error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}





