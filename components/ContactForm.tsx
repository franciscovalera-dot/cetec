'use client'

import { useRef, useState } from 'react'
import type ReCAPTCHA from 'react-google-recaptcha'
import RecaptchaWidget from './RecaptchaWidget'

/**
 * Formulario público de contacto.
 * POST → /api/contact (guarda como contactMessage en Sanity).
 * Protegido con reCAPTCHA v2 si NEXT_PUBLIC_RECAPTCHA_SITE_KEY está configurada.
 */
export default function ContactForm() {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    empresa: '',
    correo: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const captchaRef = useRef<ReCAPTCHA>(null)

  const captchaEnabled = Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY)
  const canSubmit = captchaEnabled ? Boolean(captchaToken) : true

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading' || !canSubmit) return
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          apellidos: form.apellidos,
          empresa: form.empresa,
          email: form.correo,
          telefono: form.telefono,
          asunto: form.asunto,
          mensaje: form.mensaje,
          captchaToken,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('ok')
        setMessage('¡Mensaje enviado! Te responderemos pronto.')
        setForm({ nombre: '', apellidos: '', empresa: '', correo: '', telefono: '', asunto: '', mensaje: '' })
      } else {
        setStatus('error')
        setMessage(data.error || 'Error al enviar el mensaje')
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={(e) => updateField('nombre', e.target.value)}
          placeholder="Nombre"
          className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder-gray-400 text-gray-700"
        />
        <input
          type="text"
          name="apellidos"
          value={form.apellidos}
          onChange={(e) => updateField('apellidos', e.target.value)}
          placeholder="Apellidos"
          className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder-gray-400 text-gray-700"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="empresa"
          value={form.empresa}
          onChange={(e) => updateField('empresa', e.target.value)}
          placeholder="Empresa"
          className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder-gray-400 text-gray-700"
        />
        <input
          type="email"
          name="correo"
          required
          value={form.correo}
          onChange={(e) => updateField('correo', e.target.value)}
          placeholder="Correo"
          className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder-gray-400 text-gray-700"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="tel"
          name="telefono"
          value={form.telefono}
          onChange={(e) => updateField('telefono', e.target.value)}
          placeholder="Teléfono"
          className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder-gray-400 text-gray-700"
        />
        <input
          type="text"
          name="asunto"
          value={form.asunto}
          onChange={(e) => updateField('asunto', e.target.value)}
          placeholder="Asunto"
          className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder-gray-400 text-gray-700"
        />
      </div>

      <textarea
        name="mensaje"
        required
        value={form.mensaje}
        onChange={(e) => updateField('mensaje', e.target.value)}
        placeholder="Mensaje"
        rows={5}
        className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder-gray-400 text-gray-700 resize-none"
      />

      {captchaEnabled && (
        <div className="flex justify-center">
          <RecaptchaWidget ref={captchaRef} onChange={setCaptchaToken} />
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading' || !canSubmit}
        className="w-full py-3 bg-black hover:bg-gray-700 text-white text-sm rounded-lg transition-colors disabled:opacity-60"
      >
        {status === 'loading' ? 'Enviando…' : 'Enviar'}
      </button>

      {message && (
        <p className={`text-sm text-center ${status === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </form>
  )
}
