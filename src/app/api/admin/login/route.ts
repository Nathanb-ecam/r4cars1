import { NextResponse } from 'next/server';
import { UserModel, UserRole } from '@/models/User';
import { generateToken } from '@/lib/jwt';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    console.log('Admin login attempt for:', email);
    
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');

    const admin = await UserModel.findOne({ 
      email: email.toLowerCase(),
      role: UserRole.ADMIN 
    });

    if (!admin) {
      console.log('Admin not found');
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    console.log('Admin found, verifying password');
    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);

    if (!isValidPassword) {
      console.log('Invalid password');
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    console.log('Password verified, generating token');
    const token = await generateToken({
      userId: admin._id.toString(),
      email: admin.email,
      role: admin.role
    });

    const response = NextResponse.json(
      { 
        message: 'Connexion réussie',
        user: {
          id: admin._id,
          email: admin.email,
          role: admin.role
        }
      },
      { status: 200 }
    );

    // Set the token in an HTTP-only cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    console.log('Login successful, token set in cookie');
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
} 