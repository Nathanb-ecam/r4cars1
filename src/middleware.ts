import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { UserRole } from '@/models/User';
import createIntlMiddleware from 'next-intl/middleware';
import i18nConfig from '../i18n';

const intlMiddleware = createIntlMiddleware(i18nConfig);

export const runtime = 'nodejs';

const PUBLIC_API_ROUTES = [
  '/api/visitor/affiliate-refcode-login',
  '/api/admin/login',
  '/api/products',
];

const PUBLIC_PAGES = [
  '/legal',
  '/legal/terms',
  '/legal/privacy',
  '/legal/cookies',
  '/visitor/login',
  '/admin/login',
];

// Helper to strip locale prefix from pathname
function stripLocale(pathname: string) {
  // Matches /en, /fr, /es, /en-US, etc.
  const localeRegex = /^\/[a-z]{2}(?:-[A-Z]{2})?(?=\/|$)/;
  return pathname.replace(localeRegex, '') || '/';
}

// Helper to check if a path is an admin route or page
function isAdminPath(pathname: string) {
  return pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Special case: redirect root domain to default locale visitor login
  if (pathname === '/') {
    const defaultLocale = i18nConfig.defaultLocale || 'en';
    const url = new URL(`/${defaultLocale}/visitor/login`, request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 1. Run next-intl middleware for locale handling (skip for API routes and admin pages)
  if (!pathname.startsWith('/api') && !pathname.startsWith('/admin')) {
    const intlResponse = intlMiddleware(request);
    if (intlResponse) return intlResponse;
  }

  // 2. Check for public API routes
  if (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 3. Check for public pages (with or without locale prefix, but admin pages never have locale prefix)
  const pathNoLocale = isAdminPath(pathname) ? pathname : stripLocale(pathname);
  if (PUBLIC_PAGES.some(page => pathNoLocale === page || pathNoLocale.startsWith(page + '/'))) {
    return NextResponse.next();
  }

  // 4. Require token for all other routes
  const token = request.cookies.get('token')?.value;
  if (!token) {
    // Redirect to appropriate login page (admin or visitor)
    const isAdminRoute = isAdminPath(pathname);
    let loginUrl;
    if (isAdminRoute) {
      loginUrl = '/admin/login';
    } else {
      // Try to preserve locale in redirect for visitor pages
      const localeMatch = pathname.match(/^\/[a-z]{2}(?:-[A-Z]{2})?/);
      const localePrefix = localeMatch ? localeMatch[0] : '';
      loginUrl = `${localePrefix}/visitor/login`;
    }
    const url = new URL(loginUrl, request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 5. Verify token and role
  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'secret');
    const { payload } = await jwtVerify(token, secret);

    // If accessing admin API or admin pages, require ADMIN role
    const isAdminRoute = isAdminPath(pathname);
    if (isAdminRoute && payload.role !== UserRole.ADMIN) {
      // API: return 403, Page: redirect to login
      if (pathname.startsWith('/api/')) {
        return new NextResponse(
          JSON.stringify({ error: 'Access denied: Admin role required' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        // Always redirect to /admin/login (no locale prefix)
        const url = new URL('/admin/login', request.url);
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }
    }

    // Attach token to request headers for downstream usage
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Authorization', `Bearer ${token}`);
    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch (error) {
    // Invalid token: clear cookie and redirect to login
    const isAdminRoute = isAdminPath(pathname);
    let loginUrl;
    if (isAdminRoute) {
      loginUrl = '/admin/login';
    } else {
      const localeMatch = pathname.match(/^\/[a-z]{2}(?:-[A-Z]{2})?/);
      const localePrefix = localeMatch ? localeMatch[0] : '';
      loginUrl = `${localePrefix}/visitor/login`;
    }
    const url = new URL(loginUrl, request.url);
    url.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(url);
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    // Match all routes except static files, images, _next, etc.
    '/((?!_next/static|_next/image|favicon.ico|images/|public/|api/visitor/affiliate-refcode-login|api/admin/login|api/products|legal|visitor/login|admin/login|[a-z]{2}(?:-[A-Z]{2})?/visitor/login|[a-z]{2}(?:-[A-Z]{2})?/legal|[a-z]{2}(?:-[A-Z]{2})?/legal/terms|[a-z]{2}(?:-[A-Z]{2})?/legal/privacy|[a-z]{2}(?:-[A-Z]{2})?/legal/cookies).*)',
  ],
};