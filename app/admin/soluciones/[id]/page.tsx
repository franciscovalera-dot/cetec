'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { portableTextToHtml } from '@/lib/portable-text-html'
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false })

const TECNOLOGIAS = [
  { value: 'tecnologias-verdes', label: 'Tecnologías verdes' },
  { value: 'tecnologias-digitales', label: 'Tecnologías digitales' },
  { value: 'nanotecnologia', label: 'Nanotecnología' },
  { value: 'fabricacion-avanzada', label: 'Fabricación avanzada' },
  { value: 'materiales-avanzados', label: 'Materiales avanzados' },
]
const SECTORES = [{ value: 'plastico', label: 'Plástico' }, { value: 'calzado', label: 'Calzado' }]
const RETOS = [
  { value: 'reduccion-residuos', label: 'Reducción de residuos' },
  { value: 'ahorro-energetico', label: 'Ahorro energético' },
  { value: 'calidad-reciclados', label: 'Calidad de materiales reciclados' },
  { value: 'mejora-reciclabilidad', label: 'Mejora de la reciclabilidad' },
]
const MATERIALES = [{ value: 'bioplasticos', label: 'Bioplásticos' }, { value: 'polimeros', label: 'Polímeros' }]

export default function EditarSolucionPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', tecnologia: '', sector: '', reto: '', material: '', numero: '', solicitante: '', inventor: '', fuente: '', imageAssetId: '' })

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/soluciones/${id}`)
      if (res.status === 401) { router.push('/admin/login'); return }
      if (!res.ok) { setError('No encontrado'); setLoading(false); return }
      const data = await res.json()
      setForm({
        title: data.title || '',
        description: portableTextToHtml(data.description),
        tecnologia: data.tecnologia || '',
        sector: data.sector || '',
        reto: data.reto || '',
        material: data.material || '',
        numero: data.numero || '',
        solicitante: data.solicitante || '',
        inventor: data.inventor || '',
        fuente: data.fuente || '',
        imageAssetId: data.image?.asset?._ref || '',
      })
      if (data.image?.asset?._ref) {
        const ref = data.image.asset._ref
        const parts = ref.replace('image-', '').split('-')
        if (parts.length >= 3) {
          const imgId = parts.slice(0, -1).join('-')
          const fmt = parts[parts.length - 1]
          const pid = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
          const ds = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
          setImagePreview(`https://cdn.sanity.io/images/${pid}/${ds}/${imgId}.${fmt}`)
        }
      }
      setLoading(false)
    }
    load()
  }, [id, router])

  function updateField(field: string, value: string) { setForm((prev) => ({ ...prev, [field]: value })) }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImagePreview(URL.createObjectURL(file))
    setUploadingImage(true)
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    if (res.ok) { const { assetId } = await res.json(); setForm((prev) => ({ ...prev, imageAssetId: assetId })) }
    else setError('Error al subir la imagen')
    setUploadingImage(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.title.trim()) { setError('El título es obligatorio'); return }
    setSaving(true)
    const res = await fetch(`/api/admin/soluciones/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { router.push('/admin/soluciones') } else { const d = await res.json(); setError(d.error || 'Error al guardar') }
    setSaving(false)
  }

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="flex items-center gap-3"><div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" /><span className="text-sm text-gray-900">Cargando...</span></div></div>

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/soluciones" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></Link>
            <h1 className="text-lg  text-gray-900">Editar solución</h1>
          </div>
          <button onClick={handleSubmit} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2 text-sm  text-white bg-black rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50">
            {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Guardando...</> : 'Guardar cambios'}
          </button>
        </div>
      </header>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <label className="block text-sm  text-gray-900 mb-2">Título *</label>
          <input type="text" value={form.title} onChange={(e) => updateField('title', e.target.value)} className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm  text-gray-900 mb-4">Clasificación</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs  text-gray-900 uppercase tracking-wide mb-1.5">Tecnología habilitadora</label>
              <select value={form.tecnologia} onChange={(e) => updateField('tecnologia', e.target.value)} className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"><option value="">Seleccionar...</option>{TECNOLOGIAS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select>
            </div>
            <div>
              <label className="block text-xs  text-gray-900 uppercase tracking-wide mb-1.5">Sector</label>
              <select value={form.sector} onChange={(e) => updateField('sector', e.target.value)} className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"><option value="">Seleccionar...</option>{SECTORES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
            </div>
            <div>
              <label className="block text-xs  text-gray-900 uppercase tracking-wide mb-1.5">Reto que soluciona</label>
              <select value={form.reto} onChange={(e) => updateField('reto', e.target.value)} className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"><option value="">Seleccionar...</option>{RETOS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}</select>
            </div>
            <div>
              <label className="block text-xs  text-gray-900 uppercase tracking-wide mb-1.5">Tipo de material</label>
              <select value={form.material} onChange={(e) => updateField('material', e.target.value)} className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"><option value="">Seleccionar...</option>{MATERIALES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}</select>
            </div>
          </div>
        </div>
        {/* Imagen */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm  text-gray-900 mb-4">Imagen</h3>
          {imagePreview ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
              {uploadingImage && <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center"><div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /></div>}
              <button type="button" onClick={() => { setImagePreview(null); setForm((prev) => ({ ...prev, imageAssetId: '' })) }} className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg hover:bg-black/80">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
              <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span className="text-sm text-gray-500">Haz clic para subir una imagen</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          )}
        </div>

        {/* Metadatos */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm  text-gray-900 mb-4">Datos de la solución</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs  text-gray-900 uppercase tracking-wide mb-1.5">Número / Referencia</label>
              <input type="text" value={form.numero} onChange={(e) => updateField('numero', e.target.value)} className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs  text-gray-900 uppercase tracking-wide mb-1.5">Solicitante</label>
              <input type="text" value={form.solicitante} onChange={(e) => updateField('solicitante', e.target.value)} className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs  text-gray-900 uppercase tracking-wide mb-1.5">Inventor</label>
              <input type="text" value={form.inventor} onChange={(e) => updateField('inventor', e.target.value)} className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs  text-gray-900 uppercase tracking-wide mb-1.5">Fuente</label>
              <input type="text" value={form.fuente} onChange={(e) => updateField('fuente', e.target.value)} className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <label className="block text-sm  text-gray-900 mb-2">Contenido</label>
          <RichTextEditor content={form.description} onChange={(html) => updateField('description', html)} placeholder="Contenido de la solución..." />
        </div>
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link href="/admin/soluciones" className="px-5 py-2.5 text-sm  text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">Cancelar</Link>
          <button type="submit" disabled={saving} className="px-6 py-2.5 text-sm  text-white bg-black rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar cambios'}</button>
        </div>
      </form>
    </div>
  )
}
