import { NextRequest, NextResponse } from 'next/server'
import {
  createAdminSessionToken,
  getAdminAuthCookieName,
  getTokenTtlSeconds,
  isAdminAuthConfigured,
  isValidAdminCredentials,
} from '@/lib/admin-auth'

type AttemptState = { count: number; blockedUntil: number; windowStart: number }

const attempts = new Map<string, AttemptState>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 5
const BLOCK_MS = 15 * 60 * 1000

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0]?.trim() || 'unknown'
  return request.headers.get('x-real-ip') || 'unknown'
}

function getAttemptState(ip: string) {
  const now = Date.now()
  const current = attempts.get(ip)

  if (!current || now - current.windowStart > WINDOW_MS) {
    const fresh: AttemptState = { count: 0, blockedUntil: 0, windowStart: now }
    attempts.set(ip, fresh)
    return fresh
  }

  return current
}

function isBlocked(ip: string) {
  const state = getAttemptState(ip)
  return Date.now() < state.blockedUntil
}

function registerFailure(ip: string) {
  const now = Date.now()
  const state = getAttemptState(ip)
  state.count += 1
  if (state.count >= MAX_ATTEMPTS) {
    state.blockedUntil = now + BLOCK_MS
    state.count = 0
    state.windowStart = now
  }
  attempts.set(ip, state)
}

function clearFailures(ip: string) {
  attempts.delete(ip)
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request)

  if (isBlocked(clientIp)) {
    return NextResponse.json({ ok: false, message: 'Demasiados intentos. Inténtalo más tarde.' }, { status: 429 })
  }

  try {
    if (!isAdminAuthConfigured()) {
      return NextResponse.json({ ok: false, message: 'Servicio no disponible' }, { status: 503 })
    }

    const body = await request.json()
    const username = typeof body?.username === 'string' ? body.username.trim() : ''
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!username || !password) {
      registerFailure(clientIp)
      return NextResponse.json({ ok: false, message: 'Credenciales inválidas' }, { status: 400 })
    }

    if (!isValidAdminCredentials(username, password)) {
      registerFailure(clientIp)
      return NextResponse.json({ ok: false, message: 'Credenciales inválidas' }, { status: 401 })
    }

    const token = await createAdminSessionToken()
    if (!token) {
      return NextResponse.json({ ok: false, message: 'Servicio no disponible' }, { status: 503 })
    }

    clearFailures(clientIp)

    const response = NextResponse.json({ ok: true })
    response.cookies.set(getAdminAuthCookieName(), token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: getTokenTtlSeconds(),
    })

    return response
  } catch {
    registerFailure(clientIp)
    return NextResponse.json({ ok: false, message: 'Petición inválida' }, { status: 400 })
  }
}
