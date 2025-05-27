import { NextResponse } from 'next/server';
import { UserModel, UserRole } from '@/models/User';
import connectDB from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { newAccessCode, confirmAccessCode, oldAccessCode } = await request.json();

    if (!newAccessCode || !confirmAccessCode || !oldAccessCode) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (newAccessCode !== confirmAccessCode) {
      return NextResponse.json(
        { error: 'Les codes d\'accès ne correspondent pas' },
        { status: 400 }
      );
    }

    await connectDB();
    const doctor = await UserModel.findOne({
      _id: id,
      role: UserRole.DOCTOR
    });

    if (!doctor) {
      return NextResponse.json(
        { error: 'Médecin non trouvé' },
        { status: 404 }
      );
    }

    const isValidOldAccessCode = await bcrypt.compare(oldAccessCode, doctor.passwordHash);

    if (!isValidOldAccessCode) {
      return NextResponse.json(
        { error: 'Ancien code d\'accès invalide' },
        { status: 401 }
      );
    }

    const passwordHash = await bcrypt.hash(newAccessCode, 10);

    const updatedDoctor = await UserModel.findByIdAndUpdate(
      id,
      {
        passwordHash,
        updatedAt: new Date(),
      },
      { new: true }
    ).select('-passwordHash');

    return NextResponse.json(updatedDoctor);
  } catch (error) {
    console.error('Error updating access code:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du code d\'accès' },
      { status: 500 }
    );
  }
} 