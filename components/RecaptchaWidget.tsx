'use client'

import { forwardRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

interface Props {
  onChange: (token: string | null) => void
}

/**
 * Widget reCAPTCHA v2 (checkbox "No soy un robot").
 *
 * Lee NEXT_PUBLIC_RECAPTCHA_SITE_KEY. Si no está configurada
 * (dev local), renderiza nada — el backend permitirá el request.
 *
 * Exporta la ref al componente interno para permitir .reset() tras envío.
 */
const RecaptchaWidget = forwardRef<ReCAPTCHA, Props>(function RecaptchaWidget(
  { onChange },
  ref
) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  if (!siteKey) return null

  return <ReCAPTCHA ref={ref} sitekey={siteKey} onChange={onChange} />
})

export default RecaptchaWidget
