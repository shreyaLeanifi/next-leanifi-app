import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Dose from '@/models/Dose';
import User from '@/models/User';
import { getTokenFromCookies, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = getTokenFromCookies(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const role = decoded.role?.toLowerCase();
    if (!['admin', 'clinician'].includes(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID required' }, { status: 400 });
    }

    const doses = await Dose.find({ patientId })
      .sort({ date: -1, createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({ success: true, doses });
  } catch (error) {
    console.error('Get doses error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const token = getTokenFromCookies(request);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const role = decoded.role?.toLowerCase();
    if (!['admin', 'clinician'].includes(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      patientId,
      date,
      time,
      dosage,
      injectionSite,
      status,
      medicationName,
      batchNumber,
      clinicianInitials,
      sideEffects = [],
      sideEffectsNotes = '',
      notes = '',
    } = body;

    if (!patientId || !date || !time || !dosage || !injectionSite || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate patient exists
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const administrationDateTime = new Date(`${date}T${time}`);

    const dose = new Dose({
      patientId,
      date: new Date(date),
      time: administrationDateTime,
      dosage,
      injectionSite,
      status,
      medicationName: medicationName || 'Semaglutide',
      batchNumber: batchNumber || '',
      clinicianId: decoded.userId,
      clinicianInitials: clinicianInitials || '',
      sideEffects,
      sideEffectsNotes,
      notes,
      isPatientLogged: false,
    });

    await dose.save();

    return NextResponse.json({ success: true, id: dose._id });
  } catch (error) {
    console.error('Clinician log dose error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}







