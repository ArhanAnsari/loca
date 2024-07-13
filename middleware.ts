import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Cookies from 'js-cookie';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');

  if (!token && req.nextUrl.pathname === '/chat') {
    // Redirect unauthorized users trying to access /chat
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/chat'],
};
