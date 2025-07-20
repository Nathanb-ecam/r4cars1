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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Run next-intl middleware for locale handling (skip for API routes)
  if (!pathname.startsWith('/api')) {
    const intlResponse = intlMiddleware(request);
    if (intlResponse) return intlResponse;
  }

  // 2. Check for public API routes
  if (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 3. Check for public pages (with or without locale prefix)
  const pathNoLocale = stripLocale(pathname);
  if (PUBLIC_PAGES.some(page => pathNoLocale === page || pathNoLocale.startsWith(page + '/'))) {
    return NextResponse.next();
  }

  // 4. Require token for all other routes
  const token = request.cookies.get('token')?.value;
  if (!token) {
    // Redirect to appropriate login page (admin or visitor)
    const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
    // Try to preserve locale in redirect
    const localeMatch = pathname.match(/^\/[a-z]{2}(?:-[A-Z]{2})?/);
    const localePrefix = localeMatch ? localeMatch[0] : '';
    const loginPath = isAdminRoute ? '/admin/login' : '/visitor/login';
    const url = new URL(`${localePrefix}${loginPath}`, request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 5. Verify token and role
  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'secret');
    const { payload } = await jwtVerify(token, secret);

    // If accessing admin API or admin pages, require ADMIN role
    const isAdminRoute = pathname.startsWith('/api/admin') || pathname.startsWith('/admin');
    if (isAdminRoute && payload.role !== UserRole.ADMIN) {
      // API: return 403, Page: redirect to login
      if (pathname.startsWith('/api/')) {
        return new NextResponse(
          JSON.stringify({ error: 'Access denied: Admin role required' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        // Try to preserve locale in redirect
        const localeMatch = pathname.match(/^\/[a-z]{2}(?:-[A-Z]{2})?/);
        const localePrefix = localeMatch ? localeMatch[0] : '';
        const url = new URL(`${localePrefix}/admin/login`, request.url);
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
    const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
    const localeMatch = pathname.match(/^\/[a-z]{2}(?:-[A-Z]{2})?/);
    const localePrefix = localeMatch ? localeMatch[0] : '';
    const loginPath = isAdminRoute ? '/admin/login' : '/visitor/login';
    const url = new URL(`${localePrefix}${loginPath}`, request.url);
    url.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(url);
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    // Match all routes except static files, images, _next, etc.
    '/((?!_next/static|_next/image|favicon.ico|images/|public/|api/visitor/affiliate-refcode-login|api/admin/login|api/products|legal|visitor/login|admin/login|[a-z]{2}(?:-[A-Z]{2})?/visitor/login|[a-z]{2}(?:-[A-Z]{2})?/admin/login|[a-z]{2}(?:-[A-Z]{2})?/legal|[a-z]{2}(?:-[A-Z]{2})?/legal/terms|[a-z]{2}(?:-[A-Z]{2})?/legal/privacy|[a-z]{2}(?:-[A-Z]{2})?/legal/cookies).*)',
  ],
};