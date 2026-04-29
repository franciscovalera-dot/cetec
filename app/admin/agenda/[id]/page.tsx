'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false })
import { portableTextToHtml } from '@/lib/portable-text-html'


export default function EditarEventoPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    date: '',
    endDate: '',
    location: '',
    description: '',
    link: '',
  })

  useEffect(() => {
    async function loadEvent() {
      const res = await fetch(`/api/admin/events/${id}`)
      if (res.status === 401) { router.push('/admin/login'); return }
      if (!res.ok) { setError('Evento no encontrado'); setLoading(false); return }

      const event = await res.json()

      // Formatear datetime para input datetime-local
      function toLocalDatetime(iso: string) {
        if (!iso) return ''
        const d = new Date(iso)
        const pad = (n: number) => String(n).padStart(2, '0')
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
      }

      setForm({
        title: event.title || '',
        date: toLocalDatetime(event.date),
        endDate: toLocalDatetime(event.endDate),
        location: event.location || '',
        description: portableTextToHtml(event.description),
        link: event.link || '',
      })

      setLoading(false)
    }
    loadEvent()
  }, [id, router])

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.title.trim()) { setError('El título es obligatorio'); return }
    if (!form.date) { setError('La fecha es obligatoria'); return }

    setSaving(true)

    const res = await fetch(`/api/admin/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push('/admin/agenda')
    } else {
      const data = await res.json()
      setError(data.error || 'Error al guardar los cambios')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          <span className="text-sm text-gray-900">Cargando evento...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/agenda" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg  text-gray-900">Editar evento</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm  text-white bg-black rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Guardando...</>
            ) : 'Guardar cambios'}
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
        )}

        {/* Título */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <label className="block text-sm  text-gray-900 mb-2">Título del evento *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Nombre del evento"
            className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        {/* Fechas y ubicación */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm  text-gray-900 mb-4">Fecha y lugar</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs  text-gray-900 uppercase tracking-wide mb-1.5">Fecha de inicio *</label>
              <input
                type="datetime-local"
                value={form.date}
                onChange={(e) => updateField('date', e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs  text-gray-900 uppercase tracking-wide mb-1.5">Fecha de fin</label>
              <input
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => updateField('endDate', e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs  text-gray-900 uppercase tracking-wide mb-1.5">Ubicación</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => updateField('location', e.target.value)}
                placeholder="Ciudad, País / Online"
                className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Enlace externo */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <label className="block text-sm  text-gray-900 mb-2">Enlace externo</label>
          <input
            type="url"
            value={form.link}
            onChange={(e) => updateField('link', e.target.value)}
            placeholder="https://ejemplo.com/evento"
            className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        {/* Descripción */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <label className="block text-sm  text-gray-900 mb-2">Descripción</label>
          <RichTextEditor
            content={form.description}
            onChange={(html) => updateField('description', html)}
            placeholder="Descripción del evento..."
          />
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link href="/admin/agenda" className="px-5 py-2.5 text-sm  text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">Cancelar</Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-sm  text-white bg-black rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}
