// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/database';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) throw error;

    // Protect dashboard routes
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
      const redirectUrl = new URL('/auth/login', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect authenticated users away from auth pages
    if (session && req.nextUrl.pathname.startsWith('/auth/')) {
      const redirectUrl = new URL('/dashboard', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    return res;
  } catch (e) {
    console.error('Middleware error:', e);
    // On error, redirect to login
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      const redirectUrl = new URL('/auth/login', req.url);
      return NextResponse.redirect(redirectUrl);
    }
    return res;
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*']
};