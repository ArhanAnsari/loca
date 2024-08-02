import { NextRequest, NextResponse } from 'next/server';
import { adminAuth as auth } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get('session')?.value || '';

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    return NextResponse.json({ authenticated: true, user: decodedClaims });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}