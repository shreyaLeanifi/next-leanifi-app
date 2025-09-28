import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { leanifiId, password } = await request.json();

    if (!leanifiId || !password) {
      return NextResponse.json(
        { error: 'Leanifi ID and password are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ leanifiId, isActive: true });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await generateToken(user._id.toString(), user.role);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        leanifiId: user.leanifiId,
        name: user.name,
        role: user.role,
        age: user.age,
        gender: user.gender,
        weight: user.weight,
        treatmentStartDate: user.treatmentStartDate,
        allergies: user.allergies
      }
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/' // Explicitly set path
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
