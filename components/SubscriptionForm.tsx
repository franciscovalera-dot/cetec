'use client'

import { useState } from 'react'

/**
 * Formulario de suscripción general (newsletter) — se usa en la home.
 * Conserva los estilos y dimensiones del markup anterior.
 */
export default function SubscriptionForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return
    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'general' }),
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
          disabled={status === 'loading'}
          className="px-4 py-2 text-xs text-white transition-colors whitespace-nowrap flex-shrink-0 disabled:opacity-60"
          style={{ backgroundColor: '#000000' }}
        >
          {status === 'loading' ? '…' : 'Suscríbete'}
        </button>
      </form>

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
