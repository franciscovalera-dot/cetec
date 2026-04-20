'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const TIPOS_DOCUMENTO = [
  { value: 'articulo-tecnico', label: 'Artículo técnico' },
  { value: 'boletin-vigilancia', label: 'Boletín de vigilancia' },
  { value: 'guia-buenas-practicas', label: 'Guía de buenas prácticas' },
  { value: 'informe-estado-arte', label: 'Informe de Estado del Arte' },
]

const SECTORES = [
  { value: 'plastico', label: 'Plástico' },
  { value: 'calzado', label: 'Calzado' },
  { value: 'agroalimentario', label: 'Agroalimentario' },
]

export default function EditarDocumentoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploadingFile, setUploadingFile] = useState(false)
  const [fileName, setFileName] = useState('')

  const [form, setForm] = useState({
    title: '',
    tipoDocumento: '',
    sector: '',
    description: '',
    fileAssetId: '',
    fileType: 'pdf',
  })

  useEffect(() => {
    async function loadDoc() {
      const res = await fetch(`/api/admin/documents/${id}`)
      if (res.status === 401) { router.push('/admin/login'); return }
      if (!res.ok) { setError('Documento no encontrado'); setLoading(false); return }

      const doc = await res.json()
      setForm({
        title: doc.title || '',
        tipoDocumento: doc.tipoDocumento || '',
        sector: doc.sector || '',
        description: doc.description || '',
        fileAssetId: doc.file?.asset?._id || '',
        fileType: doc.fileType || 'pdf',
      })

      if (doc.file?.asset?.originalFilename) {
        setFileName(doc.file.asset.originalFilename)
      } else if (doc.file?.asset?.url) {
        setFileName('Archivo existente')
      }

      setLoading(false)
    }
    loadDoc()
  }, [id, router])

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setUploadingFile(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'file')

    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })

    if (res.ok) {
      const { assetId } = await res.json()
      setForm((prev) => ({ ...prev, fileAssetId: assetId }))

      const ext = file.name.split('.').pop()?.toLowerCase()
      if (ext === 'pdf') updateField('fileType', 'pdf')
      else if (ext === 'docx' || ext === 'doc') updateField('fileType', 'docx')
      else if (ext === 'xlsx' || ext === 'xls') updateField('fileType', 'xlsx')
      else updateField('fileType', 'other')
    } else {
      setError('Error al subir el archivo')
    }
    setUploadingFile(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.title.trim()) { setError('El título es obligatorio'); return }

    setSaving(true)

    const res = await fetch(`/api/admin/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push('/admin/documentos')
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
          <span className="text-sm text-gray-900">Cargando documento...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/documentos" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg font-bold text-gray-900">Editar documento</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving || uploadingFile}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
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
          <label className="block text-sm font-semibold text-gray-900 mb-2">Título *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Título del documento"
            className="w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>

        {/* Categorización */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Categorización</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-900 uppercase tracking-wide mb-1.5">Tipo de documento</label>
              <select
                value={form.tipoDocumento}
                onChange={(e) => updateField('tipoDocumento', e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
              >
                <option value="">Seleccionar...</option>
                {TIPOS_DOCUMENTO.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 uppercase tracking-wide mb-1.5">Sector</label>
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

        {/* Archivo */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Archivo</h3>
          {fileName ? (
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
              <svg className="w-8 h-8 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
                {uploadingFile && <p className="text-xs text-gray-500">Subiendo...</p>}
              </div>
              <button
                type="button"
                onClick={() => { setFileName(''); setForm((prev) => ({ ...prev, fileAssetId: '' })) }}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
              <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm text-gray-500">Haz clic para subir un archivo</span>
              <span className="text-xs text-gray-400 mt-1">PDF, Word, Excel u otro</span>
              <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={handleFileUpload} className="hidden" />
            </label>
          )}
        </div>

        {/* Descripción */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Descripción breve del documento..."
            rows={4}
            className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
          />
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link href="/admin/documentos" className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">Cancelar</Link>
          <button
            type="submit"
            disabled={saving || uploadingFile}
            className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}
