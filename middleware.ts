import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login';

  // Check if user is authenticated
  const isAuthenticated = request.cookies.has('session');

  if (isPublicPath && isAuthenticated) {
    // If user is authenticated and tries to access login page,
    // redirect to their dashboard based on their role
    const session = request.cookies.get('session')?.value;
    if (session) {
      const user = JSON.parse(session);
      return NextResponse.redirect(new URL(`/dashboard/${user.role}`, request.url));
    }
  }

  if (!isPublicPath && !isAuthenticated) {
    // If user is not authenticated and tries to access protected route,
    // redirect to login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login'
  ],
};
