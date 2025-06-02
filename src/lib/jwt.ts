import { SignJWT, jwtVerify } from 'jose';
import { UserRole } from '@/models/User';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "secret");

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

import jwt from 'jsonwebtoken';

export function generateToken(payload: any) {
  return jwt.sign(payload, process.env.NEXTAUTH_SECRET!, {
    expiresIn: '1d',
  });
}


export function getTokenFromHeader(authHeader: string | undefined): string {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  return authHeader.split(' ')[1];
} 