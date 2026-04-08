import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAdminAuthCookieName, verifyAdminSessionToken } from '@/lib/admin-auth'

export async function middleware(request: NextRequest) {
  const isDev = process.env.NODE_ENV !== 'production'
  const proto = request.headers.get('x-forwarded-proto')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  if (isAdminRoute) {
    const token = request.cookies.get(getAdminAuthCookieName())?.value
    const isAuthorized = await verifyAdminSessionToken(token)
    if (!isAuthorized) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/auth/admin'
      loginUrl.searchParams.set('next', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  if (!isDev && proto && proto !== 'https') {
    const httpsUrl = request.nextUrl.clone()
    httpsUrl.protocol = 'https:'
    return NextResponse.redirect(httpsUrl, 308)
  }

  const response = NextResponse.next()

  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)']
}
