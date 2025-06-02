import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { UserRole } from '@/models/User';

export interface TokenPayload extends JWTPayload {
  userId?: string;
  email?: string;
  role: UserRole;
}

export async function generateToken(payload: TokenPayload) {
  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'secret');
  
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
    
  return token;
}

export function getTokenFromHeader(authHeader: string | undefined): string {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  return authHeader.split(' ')[1];
} 