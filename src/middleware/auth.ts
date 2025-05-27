import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, getTokenFromHeader } from '@/lib/jwt';
import { UserRole } from '@/models/User';

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: { userId: string; email: string; role: UserRole }) => Promise<NextResponse>,
  requiredRole?: UserRole
) {
  try {
    console.log("withAuth")
    const token = getTokenFromHeader(request.headers.get('authorization') || "");
    const user = await verifyToken(token);

    if (requiredRole && user.role !== requiredRole) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return handler(request, user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
} 