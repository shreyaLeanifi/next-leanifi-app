import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Dose from '@/models/Dose';
import { verifyToken, getTokenFromCookies } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Verify patient authentication
    const token = getTokenFromCookies(request);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role?.toLowerCase() !== 'patient') {
      return NextResponse.json(
        { error: 'Patient access required' },
        { status: 403 }
      );
    }

    const {
      date,
      missedReason,
      missedReasonNotes,
    } = await request.json();

    // Validate required fields
    if (!date || !missedReason) {
      return NextResponse.json(
        { error: 'Date and reason are required' },
        { status: 400 }
      );
    }

    // Check if dose already exists for this date
    const existingDose = await Dose.findOne({
      patientId: decoded.userId,
      date: new Date(date),
    });

    if (existingDose) {
      return NextResponse.json(
        { error: 'Dose already logged for this date' },
        { status: 400 }
      );
    }

    // Create missed dose record
    const dose = new Dose({
      patientId: decoded.userId,
      date: new Date(date),
      time: new Date(date), // Use date as time for missed doses
      dosage: '0.25mg', // Default dosage for missed doses
      injectionSite: 'left_arm', // Default injection site for missed doses
      status: 'missed',
      missedReason,
      missedReasonNotes: missedReasonNotes || '',
      isPatientLogged: true,
    });

    await dose.save();

    return NextResponse.json({
      success: true,
      dose: {
        id: dose._id,
        date: dose.date,
        status: dose.status,
        missedReason: dose.missedReason,
        missedReasonNotes: dose.missedReasonNotes,
      },
    });
  } catch (error) {
    console.error('Report missed dose error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
