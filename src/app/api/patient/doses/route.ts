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
      time,
      dosage,
      injectionSite,
      sideEffects,
      sideEffectsNotes,
      notes,
    } = await request.json();

    // Validate required fields
    if (!date || !time || !dosage || !injectionSite) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Create combined datetime
    const administrationDateTime = new Date(`${date}T${time}`);

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

    // Create dose record
    const dose = new Dose({
      patientId: decoded.userId,
      date: new Date(date),
      time: administrationDateTime,
      dosage,
      injectionSite,
      status: 'administered',
      sideEffects: sideEffects || [],
      sideEffectsNotes: sideEffectsNotes || '',
      notes: notes || '',
      isPatientLogged: true,
    });

    await dose.save();

    return NextResponse.json({
      success: true,
      dose: {
        id: dose._id,
        date: dose.date,
        time: dose.time,
        dosage: dose.dosage,
        injectionSite: dose.injectionSite,
        status: dose.status,
        sideEffects: dose.sideEffects,
        sideEffectsNotes: dose.sideEffectsNotes,
        notes: dose.notes,
      },
    });
  } catch (error) {
    console.error('Log dose error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
