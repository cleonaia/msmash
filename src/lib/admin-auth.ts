const ADMIN_AUTH_COOKIE = 'msmash_admin_session'
const TOKEN_TTL_SECONDS = 60 * 60 * 12

type AdminPayload = {
  sub: 'admin'
  iat: number
  exp: number
}

function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD

  if (!username || !password) return null
  return { username, password }
}

function getAdminSecret() {
  const secret = process.env.ADMIN_AUTH_SECRET
  if (!secret || secret.length < 32) return null
  return secret
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = ''
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function base64ToBytes(base64: string) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function toBase64Url(input: string) {
  return bytesToBase64(new TextEncoder().encode(input))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function fromBase64Url(input: string) {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=')
  return new TextDecoder().decode(base64ToBytes(padded))
}

async function sign(message: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  return bytesToBase64(new Uint8Array(signature))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let out = 0
  for (let i = 0; i < a.length; i += 1) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return out === 0
}

export function getAdminAuthCookieName() {
  return ADMIN_AUTH_COOKIE
}

export function getTokenTtlSeconds() {
  return TOKEN_TTL_SECONDS
}

export async function createAdminSessionToken() {
  const secret = getAdminSecret()
  if (!secret) return null

  const now = Math.floor(Date.now() / 1000)
  const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = toBase64Url(
    JSON.stringify({
      sub: 'admin',
      iat: now,
      exp: now + TOKEN_TTL_SECONDS,
    } satisfies AdminPayload)
  )

  const message = `${header}.${payload}`
  const signature = await sign(message, secret)
  return `${message}.${signature}`
}

export async function verifyAdminSessionToken(token?: string | null) {
  if (!token) return false

  const secret = getAdminSecret()
  if (!secret) return false

  const parts = token.split('.')
  if (parts.length !== 3) return false

  const [header, payload, signature] = parts
  const message = `${header}.${payload}`
  const expectedSignature = await sign(message, secret)
  if (!safeEqual(signature, expectedSignature)) return false

  try {
    const parsed = JSON.parse(fromBase64Url(payload)) as AdminPayload
    const now = Math.floor(Date.now() / 1000)
    return parsed.sub === 'admin' && parsed.exp > now
  } catch {
    return false
  }
}

export function isAdminAuthConfigured() {
  return Boolean(getAdminCredentials() && getAdminSecret())
}

export function isValidAdminCredentials(username: string, password: string) {
  const creds = getAdminCredentials()
  if (!creds) return false
  return safeEqual(username, creds.username) && safeEqual(password, creds.password)
}
