import { NextResponse } from 'next/server';

export function proxy(request) {
  const token = request.cookies.get('auth_token'); 

  const protectedPaths = ['/cart', '/order', '/checkout', '/profile'];
  
  const isProtected = protectedPaths.some((path) => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (!token && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cart/:path*', '/order/:path*', '/checkout/:path*', '/profile/:path*'],
};