// // middleware.ts

// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { jwtVerify } from 'jose';
// import { UserRole } from '@/models/User';

// import createIntlMiddleware from 'next-intl/middleware';
// import i18nConfig from '../i18n';

// const intlMiddleware = createIntlMiddleware(i18nConfig);

// export const runtime = 'nodejs';

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   console.log('\n\n\nMiddleware processing path:', pathname);
//   // First run the intl middleware to handle locale routing
//   // Skip i18n middleware for API routes
//   if (!pathname.startsWith('/api')) {
//     const intlResponse = intlMiddleware(request);
//     if (intlResponse) return intlResponse;
//   }


//   const publicRoutes = [
//     '/api/visitor/affiliate-refcode-login',
//     '/api/admin/login',
//     '/api/products'
//   ];

//   const publicPages = [
//     '/legal',
//     '/legal/terms',
//     '/legal/privacy',
//     '/legal/cookies',
//     '/legal/contact',
//     '/visitor/login',
//     '/admin/login',
//   ];


//   // const localeRegex = /^\/[a-z]{2}(?:-[A-Z]{2})?/;
//   // let pathToCheck = pathname;
//   // if (!pathname.includes('/api') && localeRegex.test(pathname)) {
//   //   pathToCheck = pathname.replace(localeRegex, '');
//   //   if (pathToCheck === '') pathToCheck = '/';
//   // }

//   if (
//     publicRoutes.some(route => pathname.startsWith(route)) 
//     // ||
//     // publicPages.some(page => pathToCheck.startsWith(page))
//   ) {
//     return NextResponse.next();
//   }

//   const token = request.cookies.get('token')?.value;
//   console.log('token',token)
//   if (!token) {
//     const isAdminRoute = pathname.startsWith('/admin') 
//     // || pathToCheck.startsWith('/admin');
//     const loginUrl = isAdminRoute ? '/admin/login' : '/visitor/login';
//     const url = new URL(loginUrl, request.url);
//     url.searchParams.set('redirect', pathname);
//     return NextResponse.redirect(url);
//   }

//   try {
//     const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'secret');
//     const { payload } = await jwtVerify(token, secret);

//     const isAdminRoute = pathname.startsWith('/api/admin') 
//     // || pathToCheck.startsWith('/api/admin');
//     if (isAdminRoute && payload.role !== UserRole.ADMIN) {
//       return new NextResponse(
//         JSON.stringify({ error: 'Access denied: Admin role required' }),
//         { status: 403, headers: { 'Content-Type': 'application/json' } }
//       );
//     }

//     const requestHeaders = new Headers(request.headers);
//     requestHeaders.set('Authorization', `Bearer ${token}`);

//     return NextResponse.next({ request: { headers: requestHeaders } });
//   } catch (error) {
//     const response = new NextResponse(
//       JSON.stringify({ error: 'Invalid token' }),
//       { status: 401, headers: { 'Content-Type': 'application/json' } }
//     );
//     response.cookies.delete('token');
//     return response;
//   }
// }

// export const config = {
//   matcher: [
//     '/((?!_next/static|_next/image|favicon.ico|images/|public/|[a-z]{2}(?:-[A-Z]{2})?/visitor/login|[a-z]{2}(?:-[A-Z]{2})?/admin/login|visitor/login|admin/login).*)',
//   ],
// };



import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
 
export default createMiddleware(routing);
 
export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};