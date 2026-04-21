'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminNav from '@/components/AdminNav'

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

interface DocItem {
  _id: string
  title: string
  tipoDocumento?: string
  sector?: string
  date?: string
  description?: string
  fileType?: string
  file?: { asset?: { url: string; originalFilename?: string } }
}

export default function AdminDocumentosPage() {
  const router = useRouter()
  const [docs, setDocs] = useState<DocItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroSector, setFiltroSector] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchDocs = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filtroTipo) params.set('tipoDocumento', filtroTipo)
    if (filtroSector) params.set('sector', filtroSector)
    if (busqueda) params.set('q', busqueda)

    const res = await fetch(`/api/admin/documents?${params.toString()}`)
    if (res.status === 401) { router.push('/admin/login'); return }

    const data = await res.json()
    setDocs(data)
    setLoading(false)
  }, [filtroTipo, filtroSector, busqueda, router])

  useEffect(() => { fetchDocs() }, [fetchDocs])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) return
    setDeleting(id)
    await fetch(`/api/admin/documents/${id}`, { method: 'DELETE' })
    setDocs((prev) => prev.filter((d) => d._id !== id))
    setDeleting(null)
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  function getTipoLabel(value: string) {
    return TIPOS_DOCUMENTO.find((t) => t.value === value)?.label || value
  }
  function getSectorLabel(value: string) {
    return SECTORES.find((s) => s.value === value)?.label || value
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-lg  text-gray-900">Admin CETEC</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-gray-900 hover:text-gray-700 transition-colors">Ver sitio</Link>
            <button onClick={handleLogout} className="text-sm text-gray-900 hover:text-red-600 transition-colors">Cerrar sesión</button>
          </div>
        </div>
      </header>

      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título y botón */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl  text-gray-900">Documentos técnicos</h2>
            <p className="text-sm text-gray-500 mt-1">{docs.length} documento{docs.length !== 1 ? 's' : ''}</p>
          </div>
          <Link
            href="/admin/documentos/nuevo"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm  text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo documento
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Buscar por título..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            >
              <option value="">Todos los tipos</option>
              {TIPOS_DOCUMENTO.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <select
              value={filtroSector}
              onChange={(e) => setFiltroSector(e.target.value)}
              className="px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            >
              <option value="">Todos los sectores</option>
              {SECTORES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
              <span className="ml-3 text-sm text-gray-900">Cargando...</span>
            </div>
          ) : docs.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-sm">No hay documentos</p>
              <Link href="/admin/documentos/nuevo" className="inline-flex items-center gap-1 mt-3 text-sm  text-gray-900 hover:text-gray-700">
                Crear el primer documento
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left text-xs  text-gray-900 uppercase tracking-wide px-6 py-3">Título</th>
                  <th className="text-left text-xs  text-gray-900 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Tipo</th>
                  <th className="text-left text-xs  text-gray-900 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Sector</th>
                  <th className="text-left text-xs  text-gray-900 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Fecha</th>
                  <th className="text-right text-xs  text-gray-900 uppercase tracking-wide px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {docs.map((doc) => (
                  <tr key={doc._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm  text-gray-900 line-clamp-1">{doc.title}</p>
                      {doc.fileType && <p className="text-xs text-gray-400 mt-0.5 uppercase">{doc.fileType}</p>}
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      {doc.tipoDocumento ? (
                        <span className="inline-block text-xs  px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full">{getTipoLabel(doc.tipoDocumento)}</span>
                      ) : <span className="text-xs text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      {doc.sector ? <span className="text-xs text-gray-900">{getSectorLabel(doc.sector)}</span> : <span className="text-xs text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="text-xs text-gray-900">
                        {doc.date ? new Date(doc.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/documentos/${doc._id}`}
                          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(doc._id, doc.title)}
                          disabled={deleting === doc._id}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
