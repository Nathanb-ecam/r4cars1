import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { DoctorModel } from '@/models/Doctor';

export async function GET() {
  try {
    await connectDB();
    const doctors = await DoctorModel.find({})
      .select('-passwordHash')
      .sort({ createdAt: -1 });
    
    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des médecins' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await connectDB();

    // Check if doctor already exists
    const existingDoctor = await DoctorModel.findOne({ 
      email: data.email.toLowerCase() 
    });

    if (existingDoctor) {
      return NextResponse.json(
        { error: 'Un médecin avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(data.password, 10);

    const doctor = await DoctorModel.create({
      ...data,      
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Remove password hash from response
    const { passwordHash: _, ...doctorWithoutPassword } = doctor.toObject();

    return NextResponse.json(doctorWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Error creating doctor:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du médecin' },
      { status: 500 }
    );
  }
} 