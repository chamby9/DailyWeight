import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/database';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  
  try {
    const { data: { session } } = await supabase.auth.getSession();

    // Only protect dashboard routes
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Redirect authenticated users away from auth pages
    if (session && req.nextUrl.pathname.startsWith('/auth/')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return res;
  } catch (e) {
    console.error('Middleware error:', e);
    return res;
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};