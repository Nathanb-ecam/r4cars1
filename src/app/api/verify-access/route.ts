import { NextResponse } from 'next/server';
import { UserModel, UserRole } from '@/models/User';
import connectDB from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { accessCode } = await request.json();

    if (!accessCode) {
      return NextResponse.json(
        { error: 'Code d\'accès requis' },
        { status: 400 }
      );
    }

    await connectDB();
    const doctor = await UserModel.findOne({
      accessCode,
      role: UserRole.DOCTOR
    });

    if (!doctor) {
      return NextResponse.json(
        { error: 'Code d\'accès invalide' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: 'Code d\'accès valide',
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email
      }
    });
  } catch (error) {
    console.error('Error verifying access code:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du code d\'accès' },
      { status: 500 }
    );
  }
} 