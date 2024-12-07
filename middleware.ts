// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/database';

export async function middleware(req: NextRequest) {
  console.log('🔵 Middleware executing for:', req.nextUrl.pathname);
  
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  
  try {
    const { data: { session } } = await supabase.auth.getSession();

    console.log('🟢 Middleware session check:', {
      hasSession: !!session,
      path: req.nextUrl.pathname,
    });

    // Only redirect if explicitly trying to access protected/auth routes
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
      console.log('🟡 Redirecting to login - no session');
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    if (session && req.nextUrl.pathname.startsWith('/auth/')) {
      console.log('🟡 Redirecting to dashboard - user is authenticated');
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return res;
  } catch (e) {
    console.error('🔴 Middleware error:', e);
    return res;
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*'
  ]
};