import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for Front Customer (Public Menu)
 * 
 * This middleware handles:
 * - Request logging (development)
 * - URL rewriting if needed
 * - Security headers
 * 
 * Note: Authentication is NOT required for public menu pages
 */

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Clone the response to add headers
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] ${request.method} ${pathname}`);
  }

  // Handle /menu route - ensure slug is present
  if (pathname === '/menu' || pathname === '/menu/') {
    // Redirect to home if no slug
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Handle root redirect to a default menu if configured
  if (pathname === '/') {
    // For now, just show the home page
    // Could redirect to a specific restaurant if needed
    return response;
  }

  // Allow all other requests
  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$).*)',
  ],
};
