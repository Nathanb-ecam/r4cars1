import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { UserRole } from '@/models/User';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isVisitorLoginPage = request.nextUrl.pathname === '/visitor/login';
  const isAdminLoginPage = request.nextUrl.pathname === '/admin/login';
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin') && !isAdminLoginPage;
  const isVisitorRoute = request.nextUrl.pathname.startsWith('/visitor') && !isVisitorLoginPage;
  const isPublicRoute = request.nextUrl.pathname === '/api/auth/access-code-login' ||
                       request.nextUrl.pathname === '/api/admin/login' ||
                       request.nextUrl.pathname === '/api/products' ||
                       request.nextUrl.pathname === '/api/orders';

  console.log('Middleware - Path:', request.nextUrl.pathname);
  console.log('Middleware - Token:', token ? 'Present' : 'Missing');
  console.log('Middleware - Is Admin Route:', isAdminRoute);
  console.log('Middleware - Is Admin Login Page:', isAdminLoginPage);
  console.log('Middleware - Is Visitor Route:', isVisitorRoute);

  // Allow public routes
  if (isPublicRoute) {
    console.log('Middleware - Allowing public route');
    return NextResponse.next();
  }

  // Handle authentication
  if (!token) {
    console.log('Middleware - No token found');
    if (isVisitorLoginPage || isAdminLoginPage) {
      return NextResponse.next();
    }
    // Redirect to appropriate login page based on the route
    if (isAdminRoute) {
      console.log('Middleware - Redirecting to admin login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    if (isVisitorRoute) {
      console.log('Middleware - Redirecting to visitor login');
      return NextResponse.redirect(new URL('/visitor/login', request.url));
    }
    return NextResponse.redirect(new URL('/visitor/login', request.url));
  }

  try {
    const user = await verifyToken(token);
    console.log('Middleware - User role:', user.role);

    // Handle admin routes
    if (isAdminRoute && user.role !== UserRole.ADMIN) {
      console.log('Middleware - Non-admin trying to access admin route');
      return NextResponse.redirect(new URL('/visitor/login', request.url));
    }

    // Redirect authenticated users away from login pages
    if (isVisitorLoginPage || isAdminLoginPage) {
      if (user.role === UserRole.ADMIN) {
        console.log('Middleware - Admin authenticated, redirecting to dashboard');
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/visitor/home', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware - Token verification error:', error);
    // Invalid token
    if (isVisitorLoginPage || isAdminLoginPage) {
      return NextResponse.next();
    }
    // Redirect to appropriate login page based on the route
    if (isAdminRoute) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.redirect(new URL('/visitor/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 