import { NextResponse, type NextRequest } from 'next/server';

const ALLOWED_ORIGINS = new Set([
  'http://localhost:8081',
  'http://127.0.0.1:8081',
  'http://localhost:3000',
]);

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'http://localhost:8081';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin');

  if (pathname === '/' || pathname === '') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (pathname.startsWith('/api/')) {
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
    }
    const requestHeaders = new Headers(request.headers);
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    Object.entries(corsHeaders(origin)).forEach(([k, v]) => response.headers.set(k, v));
    return response;
  }

  const response = NextResponse.next({ request });
  if (pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control', 'private, no-store');
  }
  return response;
}

export const config = {
  matcher: ['/', '/admin', '/admin/:path*', '/api/:path*'],
};
