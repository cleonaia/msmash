import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAdminAuthCookieName, getExpectedAdminToken } from '@/lib/admin-auth'

function unauthorizedResponse() {
  return new NextResponse('Autorizacion requerida', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="M SMASH Admin", charset="UTF-8"'
    }
  })
}

function getBasicToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Basic ')) return null

  return authHeader.slice(6)
}

function isAuthorizedAdminRequest(request: NextRequest) {
  const expectedToken = getExpectedAdminToken()
  if (!expectedToken) {
    return false
  }

  const cookieToken = request.cookies.get(getAdminAuthCookieName())?.value
  if (cookieToken === expectedToken) {
    return true
  }

  const basicToken = getBasicToken(request)
  if (!basicToken) return false

  let decoded = ''

  try {
    decoded = atob(basicToken)
  } catch {
    return false
  }

  const splitIndex = decoded.indexOf(':')
  if (splitIndex === -1) return false

  const username = decoded.slice(0, splitIndex)
  const password = decoded.slice(splitIndex + 1)

  return btoa(`${username}:${password}`) === expectedToken
}

export function middleware(request: NextRequest) {
  const isDev = process.env.NODE_ENV !== 'production'
  const proto = request.headers.get('x-forwarded-proto')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  if (isAdminRoute && !isAuthorizedAdminRequest(request)) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/auth/admin'
    loginUrl.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (!isDev && proto && proto !== 'https') {
    const httpsUrl = request.nextUrl.clone()
    httpsUrl.protocol = 'https:'
    return NextResponse.redirect(httpsUrl, 308)
  }

  const response = NextResponse.next()

  // Keep backward compatibility for direct basic-auth tools/cURL access.
  const expectedToken = getExpectedAdminToken()
  const basicToken = getBasicToken(request)
  if (expectedToken && basicToken === expectedToken) {
    response.cookies.set(getAdminAuthCookieName(), expectedToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: !isDev,
      path: '/',
      maxAge: 60 * 60 * 12,
    })
  }

  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)']
}
