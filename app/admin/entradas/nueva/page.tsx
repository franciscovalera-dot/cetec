'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false })

const SECCIONES = [
  { value: 'noticias', label: 'Noticias' },
  { value: 'normativa', label: 'Normativa y Legislación' },
  { value: 'formacion', label: 'Formación y Cursos' },
  { value: 'ayudas', label: 'Ayudas y Subvenciones' },
  { value: 'agenda', label: 'Agenda / Eventos' },
  { value: 'markettech', label: 'MarketTech' },
]

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

export default function NuevaEntradaPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const [form, setForm] = useState({
    title: '',
    seccion: '',
    tematica: '',
    sector: '',
    excerpt: '',
    body: '',
    tags: '',
    tecnologias: '',
    descriptores: '',
    imageAssetId: '',
    imageAlt: '',
  })

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview local
    setImagePreview(URL.createObjectURL(file))
    setUploadingImage(true)

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    })

    if (res.ok) {
      const { assetId } = await res.json()
      setForm((prev) => ({ ...prev, imageAssetId: assetId }))
    } else {
      setError('Error al subir la imagen')
    }
    setUploadingImage(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.title.trim()) {
      setError('El título es obligatorio')
      return
    }
    if (!form.seccion) {
      setError('La sección es obligatoria')
      return
    }

    setSaving(true)

    const res = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      const data = await res.json()
      setError(data.error || 'Error al crear la entrada')
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg  text-gray-900">Nueva entrada</h1>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving || uploadingImage}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm  text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              'Publicar'
            )}
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* ─── TÍTULO ────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <label className="block text-sm  text-gray-900 mb-2">
            Título *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Escribe el título de la entrada"
            className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            autoFocus
          />
        </div>

        {/* ─── CATEGORIZACIÓN ────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm  text-gray-900 mb-4">Categorización</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Sección principal */}
            <div>
              <label className="block text-xs  text-gray-900 uppercase tracking-wide mb-1.5">
                Sección *
              </label>
              <select
                value={form.seccion}
                onChange={(e) => updateField('seccion', e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
              >
                <option value="">Seleccionar...</option>
                {SECCIONES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Temática */}
            <div>
              <label className="block text-xs  text-gray-900 uppercase tracking-wide mb-1.5">
                Temática
              </label>
              <select
                value={form.tematica}
                onChange={(e) => updateField('tematica', e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
              >
                <option value="">Seleccionar...</option>
                {TEMATICAS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Sector */}
            <div>
              <label className="block text-xs  text-gray-900 uppercase tracking-wide mb-1.5">
                Sector
              </label>
              <select
                value={form.sector}
                onChange={(e) => updateField('sector', e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
              >
                <option value="">Seleccionar...</option>
                {SECTORES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ─── IMAGEN ────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm  text-gray-900 mb-4">Imagen principal</h3>
          <div className="space-y-3">
            {imagePreview ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null)
                    setForm((prev) => ({ ...prev, imageAssetId: '' }))
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg hover:bg-black/80"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-900">Haz clic para subir una imagen</span>
                <span className="text-xs text-gray-900 mt-1">PNG, JPG o WebP</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}

            <input
              type="text"
              value={form.imageAlt}
              onChange={(e) => updateField('imageAlt', e.target.value)}
              placeholder="Texto alternativo de la imagen"
              className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>

        {/* ─── EXTRACTO ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <label className="block text-sm  text-gray-900 mb-2">
            Extracto
          </label>
          <p className="text-xs text-gray-900 mb-2">Resumen breve que aparecerá en los listados (máx. 250 caracteres)</p>
          <textarea
            value={form.excerpt}
            onChange={(e) => updateField('excerpt', e.target.value)}
            placeholder="Escribe un resumen breve..."
            rows={3}
            maxLength={250}
            className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-900 text-right mt-1">
            {form.excerpt.length}/250
          </p>
        </div>

        {/* ─── CONTENIDO ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <label className="block text-sm  text-gray-900 mb-2">
            Contenido
          </label>
          <RichTextEditor
            content={form.body}
            onChange={(html) => updateField('body', html)}
            placeholder="Escribe el contenido del artículo..."
          />
        </div>

        {/* ─── ETIQUETAS, TECNOLOGÍAS Y DESCRIPTORES ──────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="block text-sm  text-gray-900 mb-2">Etiquetas</label>
            <p className="text-xs text-gray-500 mb-2">Separadas por comas</p>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => updateField('tags', e.target.value)}
              placeholder="plástico, reciclaje, innovación..."
              className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm  text-gray-900 mb-2">Tecnologías asociadas</label>
            <p className="text-xs text-gray-500 mb-2">Separadas por comas</p>
            <input
              type="text"
              value={form.tecnologias}
              onChange={(e) => updateField('tecnologias', e.target.value)}
              placeholder="Línea blanca, Reciclado, Novedades y tendencias..."
              className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm  text-gray-900 mb-2">Descriptores</label>
            <p className="text-xs text-gray-500 mb-2">Separadas por comas</p>
            <input
              type="text"
              value={form.descriptores}
              onChange={(e) => updateField('descriptores', e.target.value)}
              placeholder="Residuos, Envases, Sostenibilidad..."
              className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>

        {/* ─── BOTÓN FINAL ───────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/admin"
            className="px-5 py-2.5 text-sm  text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving || uploadingImage}
            className="px-6 py-2.5 text-sm  text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? 'Publicando...' : 'Publicar entrada'}
          </button>
        </div>
      </form>
    </div>
  )
}
