import { SignJWT, jwtVerify } from 'jose';
import { UserRole } from '@/models/User';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "secret");

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export async function generateToken(payload: TokenPayload): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);

  return token;
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as TokenPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function getTokenFromHeader(authHeader: string | undefined): string {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  return authHeader.split(' ')[1];
} 