/**
 * Verificación server-side de Google reCAPTCHA v2.
 *
 * Uso: await verifyRecaptcha(token) en una API route antes de procesar
 * el envío del formulario. Devuelve true si el token es válido.
 *
 * Requiere RECAPTCHA_SECRET_KEY en las variables de entorno.
 * Si no hay secret configurado (dev local sin claves), devuelve true
 * para no bloquear desarrollo — en producción asegúrate de configurarla.
 */
export async function verifyRecaptcha(token: string | undefined | null): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY

  // Si no hay secret configurado (dev), permitir. Loggea aviso.
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('RECAPTCHA_SECRET_KEY no configurado en producción — rechazando')
      return false
    }
    console.warn('RECAPTCHA_SECRET_KEY no configurado — permitiendo token en dev')
    return true
  }

  if (!token || typeof token !== 'string') return false

  try {
    const params = new URLSearchParams({ secret, response: token })
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
    const data = (await res.json()) as { success?: boolean }
    return Boolean(data.success)
  } catch (err) {
    console.error('Error verificando reCAPTCHA:', err)
    return false
  }
}
