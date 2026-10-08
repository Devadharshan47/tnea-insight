import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from './lib/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths that require authentication
  const isStudentPath = pathname.startsWith('/student') && !pathname.startsWith('/student/login');
  const isAdminPath = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');

  if (isStudentPath || isAdminPath) {
    const token = request.cookies.get('tnea_auth_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/portal/auth', request.url));
    }

    const payload = await verifyJwt(token);

    if (!payload) {
      // Invalid token
      const response = NextResponse.redirect(new URL('/portal/auth', request.url));
      response.cookies.delete('tnea_auth_token');
      return response;
    }

    // Check roles
    if (isAdminPath && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/student/dashboard', request.url));
    }

    if (isStudentPath && payload.role !== 'student') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  // Prevent logged in users from visiting the login page again
  if (pathname === '/portal/auth' || pathname === '/' || pathname === '/admin/login' || pathname === '/student/login') {
    const token = request.cookies.get('tnea_auth_token')?.value;
    if (token) {
      const payload = await verifyJwt(token);
      if (payload) {
        if (payload.role === 'admin') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        } else if (payload.role === 'student') {
          return NextResponse.redirect(new URL('/student/dashboard', request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/admin/:path*', '/portal/auth', '/'],
};
