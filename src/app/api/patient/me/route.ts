import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Dose from '@/models/Dose';
import { getTokenFromCookies, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = getTokenFromCookies(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch the current user
    const user = await User.findById(decoded.userId).select('-password');
    if (!user || user.role !== 'patient') {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Optional: derive simple computed fields
    const treatmentStartDate = user.treatmentStartDate ? new Date(user.treatmentStartDate) : null;
    const now = new Date();
    const currentWeek = treatmentStartDate
      ? Math.max(1, Math.floor((now.getTime() - treatmentStartDate.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1)
      : null;

    // Latest dose if any (patient-logged or clinician)
    const latestDose = await Dose.findOne({ patientId: user._id })
      .sort({ date: -1, createdAt: -1 })
      .lean();

    const response = {
      id: user._id,
      name: user.name,
      leanifiId: user.leanifiId,
      weight: user.weight ?? null,
      treatmentStartDate: user.treatmentStartDate ?? null,
      currentWeek,
      lastDoseDate: latestDose?.date ?? null,
      lastDoseStatus: latestDose?.status ?? 'pending',
      nextDoseDate: null as Date | null, // could be calculated later
      weightChange: null as number | null, // can be computed when we have historical weights
    };

    return NextResponse.json({ success: true, patient: response });
  } catch (error) {
    console.error('Get patient me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


