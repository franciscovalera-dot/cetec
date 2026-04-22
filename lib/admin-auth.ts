/**
 * Autenticación de admin basada en cookie con token firmado HMAC-SHA256.
 *
 * Formato del token: `${timestampB64url}.${nonceB64url}.${signatureB64url}`
 * donde signature = HMAC-SHA256(secret, `${timestampB64url}.${nonceB64url}`).
 *
 * El token NO contiene la contraseña de admin ni ningún dato reversible
 * que identifique al usuario — solo timestamp y nonce aleatorio.
 *
 * El secret se obtiene de `SESSION_SECRET`. Si no está configurado,
 * se deriva de `ADMIN_PASSWORD` + una sal fija (fallback para no exigir
 * una variable más al operador, aunque se recomienda `SESSION_SECRET`).
 * Si ninguna de las dos está presente, `checkAuth()` y `signSession()`
 * fallan de forma segura.
 */
import { cookies } from 'next/headers'
import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'admin_session'
const COOKIE_MAX_AGE_MS = 1000 * 60 * 60 * 24 // 24 horas

function base64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64url(str: string): Buffer {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4))
  return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64')
}

/** Obtiene el secret con el que firmar/verificar tokens. Devuelve null si no hay forma de derivarlo. */
function getSecret(): string | null {
  const explicit = process.env.SESSION_SECRET
  if (explicit) return explicit
  const adminPassword = process.env.ADMIN_PASSWORD
  if (adminPassword) {
    // Derivación simple: hash del password + sal fija. No es ideal pero evita
    // exigir SESSION_SECRET. En producción se recomienda definir SESSION_SECRET explícito.
    return createHmac('sha256', 'cetec-admin-session-v1').update(adminPassword).digest('hex')
  }
  return null
}

/** Genera un token de sesión firmado. Devuelve null si no se puede firmar (no hay secret). */
export function signSession(): string | null {
  const secret = getSecret()
  if (!secret) return null
  const timestamp = base64url(Buffer.from(String(Date.now())))
  const nonce = base64url(randomBytes(16))
  const payload = `${timestamp}.${nonce}`
  const signature = base64url(createHmac('sha256', secret).update(payload).digest())
  return `${payload}.${signature}`
}

/** Verifica un token de sesión. Devuelve true si es válido y no ha expirado. */
export function verifySession(token: string | undefined | null): boolean {
  if (!token || typeof token !== 'string') return false
  const secret = getSecret()
  if (!secret) return false

  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [timestampB64, nonceB64, sigB64] = parts
  const payload = `${timestampB64}.${nonceB64}`

  const expected = createHmac('sha256', secret).update(payload).digest()
  let provided: Buffer
  try {
    provided = fromBase64url(sigB64)
  } catch {
    return false
  }
  if (provided.length !== expected.length) return false
  if (!timingSafeEqual(provided, expected)) return false

  // Comprobar expiración
  let timestamp: number
  try {
    timestamp = parseInt(fromBase64url(timestampB64).toString('utf-8'), 10)
  } catch {
    return false
  }
  if (!Number.isFinite(timestamp)) return false
  if (Date.now() - timestamp > COOKIE_MAX_AGE_MS) return false

  return true
}

/** Helper de alto nivel para usar en handlers: lee cookie y verifica. */
export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return verifySession(token)
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME
export const ADMIN_COOKIE_MAX_AGE_S = COOKIE_MAX_AGE_MS / 1000
