/**
 * Verificación server-side de Google reCAPTCHA v2.
 *
 * Uso: await verifyRecaptcha(token, req?) en una API route antes de procesar
 * el envío del formulario. Devuelve true si el token es válido.
 *
 * Comportamiento FAIL-CLOSED:
 * - Por defecto, si no hay RECAPTCHA_SECRET_KEY la verificación FALLA.
 * - Para desactivar explícitamente reCAPTCHA en desarrollo local, define
 *   RECAPTCHA_DISABLED=1 en .env.local. Esto nunca debe usarse en producción.
 */
import type { NextRequest } from 'next/server'

export async function verifyRecaptcha(
  token: string | undefined | null,
  req?: NextRequest
): Promise<boolean> {
  // Opt-out explícito para dev local. Nunca usar en producción.
  if (process.env.RECAPTCHA_DISABLED === '1') {
    if (process.env.NODE_ENV === 'production') {
      console.error('RECAPTCHA_DISABLED=1 no debe usarse en producción — rechazando')
      return false
    }
    console.warn('RECAPTCHA_DISABLED=1 activo: verificación desactivada (solo dev)')
    return true
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) {
    console.error('RECAPTCHA_SECRET_KEY no configurado — rechazando por defecto (usa RECAPTCHA_DISABLED=1 solo para dev)')
    return false
  }

  if (!token || typeof token !== 'string') return false

  try {
    const params = new URLSearchParams({ secret, response: token })
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
    const data = (await res.json()) as { success?: boolean; hostname?: string }

    if (!data.success) return false

    // Validar hostname contra el origen de la request si se proporciona
    if (req && data.hostname) {
      const originHeader = req.headers.get('origin') || req.headers.get('referer')
      if (originHeader) {
        try {
          const originHostname = new URL(originHeader).hostname
          if (originHostname !== data.hostname) {
            console.warn(`reCAPTCHA hostname mismatch: token=${data.hostname} vs request=${originHostname}`)
            return false
          }
        } catch {
          // Origin header no parseable — rechazar
          return false
        }
      }
    }

    return true
  } catch (err) {
    console.error('Error verificando reCAPTCHA:', err)
    return false
  }
}
