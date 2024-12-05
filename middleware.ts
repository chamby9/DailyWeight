import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  try {
    // Create client with correct params
    const supabase = createMiddlewareClient<Database>(
      {
        cookies: () => {
          // Create an object that implements the CookieStore interface
          let cookies = new Map<string, string>();
          req.cookies.getAll().forEach(cookie => {
            cookies.set(cookie.name, cookie.value);
          });
          return {
            get: (name: string) => cookies.get(name) ?? null,
            // Add the other required methods but we don't need them
            getAll: () => [...cookies.entries()].map(([name, value]) => ({ name, value })),
            set: () => { },
            delete: () => { },
          };
        },
      },
      {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      }
    );

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
