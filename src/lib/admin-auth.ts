const ADMIN_AUTH_COOKIE = 'msmash_admin_auth'

function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD

  if (!username || !password) return null

  return { username, password }
}

export function getAdminAuthCookieName() {
  return ADMIN_AUTH_COOKIE
}

export function getExpectedAdminToken() {
  const creds = getAdminCredentials()
  if (!creds) return null
  return Buffer.from(`${creds.username}:${creds.password}`, 'utf8').toString('base64')
}

export function isValidAdminCredentials(username: string, password: string) {
  const creds = getAdminCredentials()
  if (!creds) return false
  return username === creds.username && password === creds.password
}
