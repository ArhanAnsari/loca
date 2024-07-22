import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCookie, hasCookie} from 'cookies-next';
import { cookies } from 'next/headers';
import { auth } from './lib/firebase';


export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const token = req.cookies.get('token');
  console.log('token', token);
  
  if (!token && req.nextUrl.pathname === '/chat') {
    // Redirect unauthorized users trying to access /chat
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/chat'],
};
