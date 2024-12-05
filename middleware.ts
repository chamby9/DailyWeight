import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/database';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  try {
    const supabase = createMiddlewareClient<Database>({ req, res });

    // This is key - we need to refresh the session if needed
    await supabase.auth.getSession();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Handle authentication routes
    if (session) {
      // If user is signed in, redirect away from auth pages
      if (req.nextUrl.pathname.startsWith('/auth/')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    } else {
      // If user is not signed in, redirect to login from protected pages
      if (
        req.nextUrl.pathname === '/dashboard' ||
        req.nextUrl.pathname === '/'
      ) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }
    }

    return res;
  } catch (e) {
    // If there's an error, redirect to login
    console.error('Middleware error:', e);
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
}

export const config = {
  matcher: ['/', '/dashboard', '/auth/:path*'],
};