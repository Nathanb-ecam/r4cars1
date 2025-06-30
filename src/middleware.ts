import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { UserRole } from '@/models/User';

// List of public API routes that don't require authentication
const publicRoutes = [
  '/api/visitor/affiliate-refcode-login',
  '/api/admin/login',
  '/api/products',
];

// List of public pages that don't require authentication
const publicPages = [
  '/legal',
  '/legal/terms',
  '/legal/privacy',
  '/legal/cookies',
  '/legal/contact',
  '/visitor/login',
  '/admin/login',
];

export const runtime = 'nodejs'


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('\n\n\n');
  console.log('Middleware processing path:', pathname);

  // Allow access to public API routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    console.log('Public API route, allowing access');
    return NextResponse.next();
  }

  // Allow access to public pages
  if (publicPages.some(page => pathname.startsWith(page))) {
    console.log('Public page, allowing access');
    return NextResponse.next();
  }

  // Get the token from cookies
  const token = request.cookies.get('token')?.value;
  console.log('Token from cookie:', token);

  if (!token) {
    console.log('No valid token found, determining redirect path');

    const isAdminRoute = pathname.startsWith('/admin');
    const loginUrl = isAdminRoute ? '/admin/login' : '/visitor/login';
    console.log('Redirecting to:', loginUrl);

    const url = new URL(loginUrl, request.url);
    url.searchParams.set('redirect', pathname);

    return NextResponse.redirect(url);
  }

  try {
    // Verify the token using jose
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'secret');
    const { payload } = await jwtVerify(token, secret);
    console.log('Token verified successfully:', payload);

    // Check if the route is an admin route
    const isAdminRoute = pathname.startsWith('/api/admin');
    
    // Check role permissions
    if (isAdminRoute && payload.role !== UserRole.ADMIN) {
      console.log('Access denied: Admin role required');
      return new NextResponse(
        JSON.stringify({ error: 'Access denied: Admin role required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Token is valid and role check passed — add it to Authorization header
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Authorization', `Bearer ${token}`);

    // Forward the request with updated headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Token verification error:', error);
    
    // Clear the invalid token
    const response = new NextResponse(
      JSON.stringify({ error: 'Invalid token' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
    
    // Remove the invalid token cookie
    response.cookies.delete('token');
    
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/|visitor/login|admin/login).*)',
  ],
};
