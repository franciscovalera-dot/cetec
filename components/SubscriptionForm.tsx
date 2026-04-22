'use client'

import { useRef, useState } from 'react'
import type ReCAPTCHA from 'react-google-recaptcha'
import RecaptchaWidget from './RecaptchaWidget'

/**
 * Formulario de suscripción general (newsletter) — se usa en la home.
 * Conserva los estilos y dimensiones del markup anterior.
 */
export default function SubscriptionForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const captchaRef = useRef<ReCAPTCHA>(null)

  // Si reCAPTCHA no está configurado (no hay site key), permitir submit sin token
  const captchaEnabled = Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY)
  const canSubmit = captchaEnabled ? Boolean(captchaToken) : true

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading' || !canSubmit) return
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'general', captchaToken }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('ok')
        setMessage('¡Suscrito! Gracias por apuntarte.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Error al suscribirse')
      }
    } catch {
      setStatus('error')
      setMessage('Error de conexión')
    } finally {
      captchaRef.current?.reset()
      setCaptchaToken(null)
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-8 flex items-stretch max-w-[280px] mx-auto bg-white rounded-md overflow-hidden"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="flex-1 px-3 py-2 text-xs focus:outline-none bg-white placeholder-gray-400 min-w-0"
          style={{ color: '#000000' }}
        />
        <button
          type="submit"
          disabled={status === 'loading' || !canSubmit}
          className="px-4 py-2 text-xs text-white transition-colors whitespace-nowrap flex-shrink-0 disabled:opacity-60"
          style={{ backgroundColor: '#000000' }}
        >
          {status === 'loading' ? '…' : 'Suscríbete'}
        </button>
      </form>

      {captchaEnabled && (
        <div className="mt-4 flex justify-center">
          <RecaptchaWidget ref={captchaRef} onChange={setCaptchaToken} />
        </div>
      )}

      {message && (
        <p
          className={`mt-3 text-xs ${status === 'ok' ? 'text-white' : 'text-red-300'}`}
          style={status === 'ok' ? { mixBlendMode: 'difference' } : undefined}
        >
          {message}
        </p>
      )}
    </>
  )
}
