import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { UserRole } from '@/models/User';
import createIntlMiddleware from 'next-intl/middleware';
import i18nConfig from '../i18n';

const intlMiddleware = createIntlMiddleware(i18nConfig);

export const runtime = 'nodejs';

const VISITOR_LOGIN_URL = "/visitor/login"
const ADMIN_LOGIN_URL = "/admin/login"



const PUBLIC_API_ROUTES = [
  '/api/visitor/affiliate-refcode-login',
  '/api/admin/login',
  '/api/products',
];

const LEGAL_PAGES = [  
  '/terms',
  '/privacy',
  '/cookies',
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

async function isTokenValid(token: string, role : string){
  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'secret');
  const { payload } = await jwtVerify(token, secret);
  
  if(payload.role == role) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("DEBUG MIDDLEWARE")
  console.log(pathname)
  // Special case: redirect root domain to default locale visitor login
  if (pathname === '/') {
    const defaultLocale = i18nConfig.defaultLocale || 'en';
    const url = new URL(`/${defaultLocale}/visitor/login`, request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }  
  
  if(pathname == "/visitor/login") {    
    return NextResponse.redirect(new URL(`/en/${VISITOR_LOGIN_URL}`, request.url))
  }

  if(pathname.includes('/visitor/screens/')){    
    console.log("UNO")
    const token = request.cookies.get('token')?.value;
    if(!token) return NextResponse.redirect(new URL(VISITOR_LOGIN_URL, request.url));
    const isValid = await isTokenValid(token, UserRole.VISITOR)
    if(isValid){
      const intlResponse = intlMiddleware(request);
      if (intlResponse) return intlResponse;
    }
    return NextResponse.redirect(new URL(VISITOR_LOGIN_URL, request.url));
  }

  // if(pathname.includes('/api/admin')){
  //   const token = request.cookies.get('token')?.value;
    // if(!token) return new NextResponse(
    //   JSON.stringify({ error: 'Access denied: Admin role required' }),
    //   { status: 403, headers: { 'Content-Type': 'application/json' } }
    // );
  //   const isValid = await isTokenValid(token, UserRole.ADMIN)

  // }

  if(pathname.includes('/admin/') && pathname != "/admin/login"){    
    console.log("DOS")
    const token = request.cookies.get('token')?.value;
    if(!token) return NextResponse.redirect(new URL(ADMIN_LOGIN_URL, request.url));
    const isValid = await isTokenValid(token, UserRole.ADMIN)
    if(isValid){
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('Authorization', `Bearer ${token}`);
      return NextResponse.next({ request: { headers: requestHeaders } });
    }
    return NextResponse.redirect(new URL(ADMIN_LOGIN_URL, request.url));
  }


  if(pathname.includes('/api/') && pathname !== "/api/visitor/affiliate-refcode-login"){
    const token = request.cookies.get('token')?.value;
    if(!token) return NextResponse.json("No token provied")
    const isValid = await isTokenValid(token, UserRole.ADMIN)
    if(!isValid) return NextResponse.json({error: 'Access denied: Admin role required' }, { status: 403, headers: { 'Content-Type': 'application/json' } });
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Authorization', `Bearer ${token}`);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }


  if(LEGAL_PAGES.includes(pathname)){
    const intlResponse = intlMiddleware(request);
    if (intlResponse) return intlResponse;
  }
      
  
  

}

export const config = {
  matcher: ["/((?!_next/|api/|public/|images/|favicon.ico).*)"]
};