import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

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

  // Use next-auth to decode the JWT
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET, cookieName: 'token' });
  console.log(token)
  if (!token) {
    console.log('No valid token found, determining redirect path');

    const isAdminRoute = pathname.startsWith('/admin');
    const loginUrl = isAdminRoute ? '/admin/login' : '/visitor/login';
    console.log('Redirecting to:', loginUrl);

    const url = new URL(loginUrl, request.url);
    url.searchParams.set('redirect', pathname);

    return NextResponse.redirect(url);
  }

  // Token is valid — add it to Authorization header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('Authorization', `Bearer ${token}`);

  // Forward the request with updated headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/|visitor/login|admin/login).*)',
  ],
};
