'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminNav from '@/components/AdminNav'

interface EventItem {
  _id: string
  title: string
  date: string
  endDate?: string
  location?: string
  link?: string
}

export default function AdminAgendaPage() {
  const router = useRouter()
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroPeriodo, setFiltroPeriodo] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filtroPeriodo) params.set('periodo', filtroPeriodo)
    if (busqueda) params.set('q', busqueda)

    const res = await fetch(`/api/admin/events?${params.toString()}`)
    if (res.status === 401) { router.push('/admin/login'); return }

    const data = await res.json()
    setEvents(data)
    setLoading(false)
  }, [filtroPeriodo, busqueda, router])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) return
    setDeleting(id)
    await fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
    setEvents((prev) => prev.filter((e) => e._id !== id))
    setDeleting(null)
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
            <h2 className="text-2xl  text-gray-900">Agenda de eventos</h2>
            <p className="text-sm text-gray-500 mt-1">{events.length} evento{events.length !== 1 ? 's' : ''}</p>
          </div>
          <Link
            href="/admin/agenda/nuevo"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm  text-white bg-black rounded-xl hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo evento
          </Link>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Buscar por título o ubicación..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <select
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
              className="px-4 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            >
              <option value="">Todos los eventos</option>
              <option value="proximos">Próximos</option>
              <option value="pasados">Pasados</option>
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
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-sm">No hay eventos</p>
              <Link href="/admin/agenda/nuevo" className="inline-flex items-center gap-1 mt-3 text-sm  text-gray-900 hover:text-gray-700">
                Crear el primer evento
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left text-xs  text-gray-900 uppercase tracking-wide px-6 py-3">Título</th>
                  <th className="text-left text-xs  text-gray-900 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Fecha</th>
                  <th className="text-left text-xs  text-gray-900 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Ubicación</th>
                  <th className="text-left text-xs  text-gray-900 uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Estado</th>
                  <th className="text-right text-xs  text-gray-900 uppercase tracking-wide px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((event) => {
                  const isPast = new Date(event.date) < new Date()
                  return (
                    <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm  text-gray-900 line-clamp-1">{event.title}</p>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-xs text-gray-900">
                          {new Date(event.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        {event.location ? <span className="text-xs text-gray-900">{event.location}</span> : <span className="text-xs text-gray-400">—</span>}
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className={`inline-block text-xs  px-2.5 py-1 rounded-full ${isPast ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-700'}`}>
                          {isPast ? 'Finalizado' : 'Próximo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/agenda/${event._id}`}
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDelete(event._id, event.title)}
                            disabled={deleting === event._id}
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
