import { NextResponse } from 'next/server'

export async function middleware(request) {
  // Try to refresh Supabase session, but don't block if it fails
  try {
    const { updateSession } = await import('@/utils/supabase/middleware');
    return await updateSession(request);
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
