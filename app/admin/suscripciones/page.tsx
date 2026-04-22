'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminNav from '@/components/AdminNav'

const TYPE_LABELS: Record<string, string> = {
  general: 'Newsletter',
  'search-alert': 'Alerta',
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

interface Subscription {
  _id: string
  email: string
  type: 'general' | 'search-alert'
  query?: string
  seccion?: string
  tematica?: string
  sector?: string
  idioma?: string
  createdAt: string
}

export default function AdminSuscripcionesPage() {
  const router = useRouter()
  const [subs, setSubs] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroTipo, setFiltroTipo] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchSubs = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filtroTipo) params.set('type', filtroTipo)
    if (busqueda) params.set('q', busqueda)

    const res = await fetch(`/api/admin/subscriptions?${params.toString()}`)
    if (res.status === 401) { router.push('/admin/login'); return }

    const data = await res.json()
    setSubs(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [filtroTipo, busqueda, router])

  useEffect(() => { fetchSubs() }, [fetchSubs])

  async function handleDelete(id: string, email: string) {
    if (!confirm(`¿Eliminar suscripción de "${email}"? Esta acción no se puede deshacer.`)) return
    setDeleting(id)
    await fetch(`/api/admin/subscriptions/${id}`, { method: 'DELETE' })
    setSubs((prev) => prev.filter((s) => s._id !== id))
    setDeleting(null)
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  function exportCSV() {
    const header = ['email', 'tipo', 'query', 'seccion', 'tematica', 'sector', 'idioma', 'createdAt']
    const rows = subs.map((s) => [
      s.email,
      s.type,
      s.query || '',
      s.seccion || '',
      s.tematica || '',
      s.sector || '',
      s.idioma || '',
      s.createdAt,
    ])
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `suscripciones-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function filtersChips(s: Subscription): string[] {
    const chips: string[] = []
    if (s.query)    chips.push(`"${s.query}"`)
    if (s.seccion)  chips.push(SECCIONES_LABELS[s.seccion] || s.seccion)
    if (s.tematica) chips.push(TEMATICAS_LABELS[s.tematica] || s.tematica)
    if (s.sector)   chips.push(SECTORES_LABELS[s.sector] || s.sector)
    if (s.idioma)   chips.push(IDIOMAS_LABELS[s.idioma] || s.idioma)
    return chips
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl  text-gray-900">Suscripciones</h2>
            <p className="text-sm text-gray-500 mt-1">
              {subs.length} suscripci{subs.length !== 1 ? 'ones' : 'ón'}
            </p>
          </div>
          <button
            onClick={exportCSV}
            disabled={subs.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm  text-white bg-black rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exportar CSV
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Buscar por email o query…"
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
              <option value="general">Newsletter</option>
              <option value="search-alert">Alertas de búsqueda</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
              <span className="ml-3 text-sm text-gray-900">Cargando…</span>
            </div>
          ) : subs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-sm">No hay suscripciones todavía.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left text-xs  text-gray-900 uppercase tracking-wide px-6 py-3">Email</th>
                  <th className="text-left text-xs  text-gray-900 uppercase tracking-wide px-4 py-3">Tipo</th>
                  <th className="text-left text-xs  text-gray-900 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Filtros</th>
                  <th className="text-left text-xs  text-gray-900 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Fecha</th>
                  <th className="text-right text-xs  text-gray-900 uppercase tracking-wide px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subs.map((s) => {
                  const chips = filtersChips(s)
                  const date = s.createdAt
                    ? new Date(s.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
                    : '—'
                  return (
                    <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{s.email}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-block text-xs px-2.5 py-1 rounded-full ${
                          s.type === 'general'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {TYPE_LABELS[s.type] || s.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        {chips.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {chips.map((c, i) => (
                              <span key={i} className="inline-block text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">{c}</span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-xs text-gray-500">{date}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(s._id, s.email)}
                          disabled={deleting === s._id}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
