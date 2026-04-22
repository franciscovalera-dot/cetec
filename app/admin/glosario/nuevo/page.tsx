'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false })

const TEMATICAS = [
  { value: 'materiales', label: 'Materiales' },
  { value: 'procesos', label: 'Procesos' },
  { value: 'digitalizacion', label: 'Digitalización' },
  { value: 'reciclado', label: 'Reciclado' },
  { value: 'ecodiseno', label: 'Ecodiseño' },
]

const SECTORES = [
  { value: 'plastico', label: 'Plástico' },
  { value: 'calzado', label: 'Calzado' },
  { value: 'agroalimentario', label: 'Agroalimentario' },
]

export default function NuevoTerminoPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    term: '',
    definition: '',
    tematica: '',
    sector: '',
  })

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.term.trim()) { setError('El término es obligatorio'); return }
    if (!form.definition.trim()) { setError('La definición es obligatoria'); return }

    setSaving(true)

    const res = await fetch('/api/admin/glossary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push('/admin/glosario')
    } else {
      const data = await res.json()
      setError(data.error || 'Error al crear el término')
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/glosario" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg  text-gray-900">Nuevo término</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm  text-white bg-black rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Guardando...</>
            ) : 'Publicar'}
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
        )}

        {/* Término */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <label className="block text-sm  text-gray-900 mb-2">Término *</label>
          <input
            type="text"
            value={form.term}
            onChange={(e) => updateField('term', e.target.value)}
            placeholder="Nombre del término"
            className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            autoFocus
          />
        </div>

        {/* Categorización */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm  text-gray-900 mb-4">Categorización</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs  text-gray-900 uppercase tracking-wide mb-1.5">Temática</label>
              <select
                value={form.tematica}
                onChange={(e) => updateField('tematica', e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
              >
                <option value="">Seleccionar...</option>
                {TEMATICAS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs  text-gray-900 uppercase tracking-wide mb-1.5">Sector</label>
              <select
                value={form.sector}
                onChange={(e) => updateField('sector', e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
              >
                <option value="">Seleccionar...</option>
                {SECTORES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Definición */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <label className="block text-sm  text-gray-900 mb-2">Definición *</label>
          <RichTextEditor
            content={form.definition}
            onChange={(html) => updateField('definition', html)}
            placeholder="Escribe la definición del término..."
          />
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link href="/admin/glosario" className="px-5 py-2.5 text-sm  text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">Cancelar</Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-sm  text-white bg-black rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? 'Publicando...' : 'Publicar término'}
          </button>
        </div>
      </form>
    </div>
  )
}
