'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Constantes de filtros (duplicadas aquí para uso client-side)
const SECCIONES = [
  { value: 'noticias', label: 'Noticias' },
  { value: 'normativa', label: 'Normativa' },
  { value: 'formacion', label: 'Formación' },
  { value: 'ayudas', label: 'Ayudas' },
  { value: 'agenda', label: 'Agenda' },
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

interface PostItem {
  _id: string
  title: string
  slug: { current: string }
  seccion: string
  tematica?: string
  sector?: string
  publishedAt: string
  excerpt?: string
  author?: { name: string }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [posts, setPosts] = useState<PostItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroSeccion, setFiltroSeccion] = useState('')
  const [filtroTematica, setFiltroTematica] = useState('')
  const [filtroSector, setFiltroSector] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filtroSeccion) params.set('seccion', filtroSeccion)
    if (filtroTematica) params.set('tematica', filtroTematica)
    if (filtroSector) params.set('sector', filtroSector)
    if (busqueda) params.set('q', busqueda)

    const res = await fetch(`/api/admin/posts?${params.toString()}`)

    if (res.status === 401) {
      router.push('/admin/login')
      return
    }

    const data = await res.json()
    setPosts(data)
    setLoading(false)
  }, [filtroSeccion, filtroTematica, filtroSector, busqueda, router])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) return
    setDeleting(id)
    await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
    setPosts((prev) => prev.filter((p) => p._id !== id))
    setDeleting(null)
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  function getSeccionLabel(value: string) {
    return SECCIONES.find((s) => s.value === value)?.label || value
  }

  function getTematicaLabel(value: string) {
    return TEMATICAS.find((t) => t.value === value)?.label || value
  }

  function getSectorLabel(value: string) {
    return SECTORES.find((s) => s.value === value)?.label || value
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ─── HEADER ──────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-gray-900">Admin CETEC</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-gray-900 hover:text-gray-700 transition-colors"
            >
              Ver sitio
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-900 hover:text-red-600 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ─── TÍTULO Y BOTÓN NUEVA ENTRADA ──────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Entradas</h2>
            <p className="text-sm text-gray-900 mt-1">
              {posts.length} entrada{posts.length !== 1 ? 's' : ''} encontrada{posts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            href="/admin/entradas/nueva"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva entrada
          </Link>
        </div>

        {/* ─── FILTROS ───────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Búsqueda */}
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Buscar por título..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            {/* Sección */}
            <select
              value={filtroSeccion}
              onChange={(e) => setFiltroSeccion(e.target.value)}
              className="px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            >
              <option value="">Todas las secciones</option>
              {SECCIONES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            {/* Temática */}
            <select
              value={filtroTematica}
              onChange={(e) => setFiltroTematica(e.target.value)}
              className="px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            >
              <option value="">Todas las temáticas</option>
              {TEMATICAS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>

            {/* Sector */}
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

        {/* ─── TABLA DE ENTRADAS ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
              <span className="ml-3 text-sm text-gray-900">Cargando...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-gray-900 text-sm">No hay entradas</p>
              <Link
                href="/admin/entradas/nueva"
                className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-gray-900 hover:text-gray-700"
              >
                Crear la primera entrada
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-900 uppercase tracking-wide px-6 py-3">Título</th>
                  <th className="text-left text-xs font-semibold text-gray-900 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Sección</th>
                  <th className="text-left text-xs font-semibold text-gray-900 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Temática</th>
                  <th className="text-left text-xs font-semibold text-gray-900 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Sector</th>
                  <th className="text-left text-xs font-semibold text-gray-900 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Fecha</th>
                  <th className="text-right text-xs font-semibold text-gray-900 uppercase tracking-wide px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{post.title}</p>
                      {post.author?.name && (
                        <p className="text-xs text-gray-900 mt-0.5">{post.author.name}</p>
                      )}
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="inline-block text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full">
                        {getSeccionLabel(post.seccion)}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      {post.tematica ? (
                        <span className="text-xs text-gray-900">{getTematicaLabel(post.tematica)}</span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      {post.sector ? (
                        <span className="text-xs text-gray-900">{getSectorLabel(post.sector)}</span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="text-xs text-gray-900">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
                          : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/entradas/${post._id}`}
                          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id, post.title)}
                          disabled={deleting === post._id}
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
