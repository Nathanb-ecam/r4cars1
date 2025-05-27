import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Doctor } from '@/models/Doctor';
import { UserRole } from '@/models/User';
import { generateToken } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { doctorNumber, accessCode } = await request.json();

    const doctor = await Doctor.findOne({ doctorNumber });
    if (!doctor || doctor.accessCode !== accessCode) {
      return NextResponse.json(
        { error: 'Invalid doctor number or access code' },
        { status: 401 }
      );
    }


    const token = await generateToken({      
      role: UserRole.VISITOR,
      userId:"",
      email:""
    });

    const response = NextResponse.json(
      { 
        message: 'Login successful',        
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Access code login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 