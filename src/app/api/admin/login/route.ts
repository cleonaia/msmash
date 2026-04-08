import { NextRequest, NextResponse } from 'next/server'
import { getAdminAuthCookieName, getExpectedAdminToken, isValidAdminCredentials } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const username = typeof body?.username === 'string' ? body.username.trim() : ''
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!username || !password) {
      return NextResponse.json({ ok: false, message: 'Faltan credenciales' }, { status: 400 })
    }

    if (!isValidAdminCredentials(username, password)) {
      return NextResponse.json({ ok: false, message: 'Usuario o contraseña incorrectos' }, { status: 401 })
    }

    const token = getExpectedAdminToken()
    if (!token) {
      return NextResponse.json({ ok: false, message: 'Admin no configurado en entorno' }, { status: 500 })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set(getAdminAuthCookieName(), token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 12,
    })

    return response
  } catch {
    return NextResponse.json({ ok: false, message: 'Petición inválida' }, { status: 400 })
  }
}
