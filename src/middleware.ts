import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
//import { isAuthenticated } from '@/lib/auth'; // We need a way to check this without cookies() directly in middleware

const SESSION_COOKIE_NAME = 'csskins_session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if trying to access admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    let authed = false;
    if (sessionCookie && sessionCookie.value) {
      try {
        // Basic check, actual validation would be more robust
        const sessionData = JSON.parse(sessionCookie.value);
        if (sessionData.username) {
          authed = true;
        }
      } catch (e) {
        // Invalid cookie
      }
    }

    if (!authed) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname); // Optional: redirect back after login
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], // Apply middleware to all /admin routes
};
