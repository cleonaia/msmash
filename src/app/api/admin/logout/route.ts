import { NextResponse } from 'next/server'
import { getAdminAuthCookieName } from '@/lib/admin-auth'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(getAdminAuthCookieName(), '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
  return response
}
