'use client'

import { useRef, useState } from 'react'
import type ReCAPTCHA from 'react-google-recaptcha'
import RecaptchaWidget from './RecaptchaWidget'

interface Props {
  query?: string
  seccion?: string
  tematica?: string
  sector?: string
  idioma?: string
}

const SECCIONES_LABELS: Record<string, string> = {
  noticias: 'Noticias',
  normativa: 'Normativa',
  formacion: 'Formación',
  ayudas: 'Ayudas',
  agenda: 'Agenda',
  markettech: 'MarketTech',
}
const TEMATICAS_LABELS: Record<string, string> = {
  materiales: 'Materiales',
  procesos: 'Procesos',
  digitalizacion: 'Digitalización',
  reciclado: 'Reciclado',
  ecodiseno: 'Ecodiseño',
}
const SECTORES_LABELS: Record<string, string> = {
  plastico: 'Plástico',
  calzado: 'Calzado',
  agroalimentario: 'Agroalimentario',
}
const IDIOMAS_LABELS: Record<string, string> = {
  es: 'Español',
  en: 'English',
}

/**
 * Botón "Crear alerta" + modal. Captura email y envía a /api/subscriptions
 * junto con los filtros de búsqueda actuales (type = 'search-alert').
 */
export default function AlertModal({ query, seccion, tematica, sector, idioma }: Props) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const captchaRef = useRef<ReCAPTCHA>(null)

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
        body: JSON.stringify({
          email,
          type: 'search-alert',
          query,
          seccion,
          tematica,
          sector,
          idioma,
          captchaToken,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('ok')
        setMessage('¡Alerta creada! Recibirás avisos por email.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Error al crear la alerta')
      }
    } catch {
      setStatus('error')
      setMessage('Error de conexión')
    } finally {
      captchaRef.current?.reset()
      setCaptchaToken(null)
    }
  }

  function closeModal() {
    setOpen(false)
    // Reset tras cerrar
    setTimeout(() => {
      setStatus('idle')
      setMessage('')
    }, 200)
  }

  const chips: { key: string; label: string }[] = []
  if (query)    chips.push({ key: 'q',   label: `"${query}"` })
  if (seccion)  chips.push({ key: 'sec', label: SECCIONES_LABELS[seccion] || seccion })
  if (tematica) chips.push({ key: 'tem', label: TEMATICAS_LABELS[tematica] || tematica })
  if (sector)   chips.push({ key: 'sct', label: SECTORES_LABELS[sector] || sector })
  if (idioma)   chips.push({ key: 'idi', label: IDIOMAS_LABELS[idioma] || idioma })

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs text-white bg-black hover:bg-gray-700 rounded-full transition-colors"
      >
        Crear alerta
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg text-gray-900">Crear alerta</h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                aria-label="Cerrar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Recibirás un correo cuando se publique contenido que coincida con esta búsqueda.
            </p>

            {chips.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-5">
                {chips.map((c) => (
                  <span
                    key={c.key}
                    className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full"
                  >
                    {c.label}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic mb-5">
                Sin filtros — recibirás todo el contenido nuevo.
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
              />

              {captchaEnabled && (
                <div className="flex justify-center">
                  <RecaptchaWidget ref={captchaRef} onChange={setCaptchaToken} />
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading' || status === 'ok' || !canSubmit}
                className="w-full py-2.5 text-sm text-white bg-black rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-60"
              >
                {status === 'loading' ? 'Creando…' : status === 'ok' ? '¡Creada!' : 'Confirmar alerta'}
              </button>
            </form>

            {message && (
              <p
                className={`mt-3 text-xs text-center ${
                  status === 'ok' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
