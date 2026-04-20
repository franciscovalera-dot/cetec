'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminNav from '@/components/AdminNav'

const TECNOLOGIAS = [
  { value: 'tecnologias-verdes', label: 'Tecnologías verdes' },
  { value: 'tecnologias-digitales', label: 'Tecnologías digitales' },
  { value: 'nanotecnologia', label: 'Nanotecnología' },
  { value: 'fabricacion-avanzada', label: 'Fabricación avanzada' },
  { value: 'materiales-avanzados', label: 'Materiales avanzados' },
]
const SECTORES = [
  { value: 'plastico', label: 'Plástico' },
  { value: 'calzado', label: 'Calzado' },
]

interface SolItem {
  _id: string
  title: string
  tecnologia?: string
  sector?: string
  reto?: string
  material?: string
}

export default function AdminSolucionesPage() {
  const router = useRouter()
  const [items, setItems] = useState<SolItem[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroTec, setFiltroTec] = useState('')
  const [filtroSector, setFiltroSector] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (busqueda) params.set('q', busqueda)
    if (filtroTec) params.set('tecnologia', filtroTec)
    if (filtroSector) params.set('sector', filtroSector)
    const res = await fetch(`/api/admin/soluciones?${params.toString()}`)
    if (res.status === 401) { router.push('/admin/login'); return }
    setItems(await res.json())
    setLoading(false)
  }, [busqueda, filtroTec, filtroSector, router])

  useEffect(() => { fetchItems() }, [fetchItems])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`¿Eliminar "${title}"?`)) return
    setDeleting(id)
    await fetch(`/api/admin/soluciones/${id}`, { method: 'DELETE' })
    setItems((prev) => prev.filter((s) => s._id !== id))
    setDeleting(null)
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  function getTecLabel(v: string) { return TECNOLOGIAS.find((t) => t.value === v)?.label || v }
  function getSectorLabel(v: string) { return SECTORES.find((s) => s.value === v)?.label || v }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h1 className="text-lg font-bold text-gray-900">Admin CETEC</h1>
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
            <h2 className="text-2xl font-bold text-gray-900">MarketTech — Soluciones</h2>
            <p className="text-sm text-gray-500 mt-1">{items.length} solución{items.length !== 1 ? 'es' : ''}</p>
          </div>
          <Link href="/admin/soluciones/nuevo" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Nueva solución
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="lg:col-span-2">
              <input type="text" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" />
            </div>
            <select value={filtroTec} onChange={(e) => setFiltroTec(e.target.value)} className="px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white">
              <option value="">Todas las tecnologías</option>
              {TECNOLOGIAS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select value={filtroSector} onChange={(e) => setFiltroSector(e.target.value)} className="px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white">
              <option value="">Todos los sectores</option>
              {SECTORES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" /><span className="ml-3 text-sm text-gray-900">Cargando...</span></div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-sm">No hay soluciones</p>
              <Link href="/admin/soluciones/nuevo" className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-gray-900 hover:text-gray-700">Crear la primera<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-900 uppercase tracking-wide px-6 py-3">Título</th>
                  <th className="text-left text-xs font-semibold text-gray-900 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Tecnología</th>
                  <th className="text-left text-xs font-semibold text-gray-900 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Sector</th>
                  <th className="text-right text-xs font-semibold text-gray-900 uppercase tracking-wide px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4"><p className="text-sm font-medium text-gray-900 line-clamp-1">{s.title}</p></td>
                    <td className="px-4 py-4 hidden md:table-cell">{s.tecnologia ? <span className="inline-block text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full">{getTecLabel(s.tecnologia)}</span> : <span className="text-xs text-gray-400">—</span>}</td>
                    <td className="px-4 py-4 hidden lg:table-cell">{s.sector ? <span className="text-xs text-gray-900">{getSectorLabel(s.sector)}</span> : <span className="text-xs text-gray-400">—</span>}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/soluciones/${s._id}`} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Editar"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></Link>
                        <button onClick={() => handleDelete(s._id, s.title)} disabled={deleting === s._id} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" title="Eliminar"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
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
