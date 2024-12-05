
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './app/api/auth/[...nextauth]/route';

export async function middleware(req) {
  const session = await getServerSession({ req, authOptions });

  if (!session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/user-page/:path*',
};