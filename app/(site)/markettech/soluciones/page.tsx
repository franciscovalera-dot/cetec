/**
 * PÁGINA DE LISTADO DE SOLUCIONES — MarketTech
 * Buscador + filtros + grid de soluciones tecnológicas.
 */
'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'

interface Solucion {
  _id: string
  slug: string
  title: string
  description?: string
  tecnologia?: string
  sector?: string
  reto?: string
  material?: string
}

const ITEMS_PER_PAGE = 12

const filterOptions = {
  tecnologia: ['Tecnologías verdes', 'Tecnologías digitales', 'Nanotecnología', 'Fabricación avanzada', 'Materiales avanzados'],
  sector: ['Plástico', 'Calzado'],
  reto: ['Reducción de residuos', 'Ahorro energético', 'Calidad de materiales reciclados', 'Mejora de la reciclabilidad'],
  material: ['Bioplásticos', 'Polímeros'],
}

export default function MarketTechSolucionesPage() {
  const [soluciones, setSoluciones] = useState<Solucion[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroTecnologia, setFiltroTecnologia] = useState('')
  const [filtroSector, setFiltroSector] = useState('')
  const [filtroReto, setFiltroReto] = useState('')
  const [filtroMaterial, setFiltroMaterial] = useState('')
  const [pagina, setPagina] = useState(1)

  const fetchSoluciones = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/soluciones')
    if (res.ok) setSoluciones(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchSoluciones() }, [fetchSoluciones])

  // Filtrar soluciones
  const filtered = soluciones.filter((s: Solucion) => {
    if (busqueda && !s.title.toLowerCase().includes(busqueda.toLowerCase()) && !(s.description || '').toLowerCase().includes(busqueda.toLowerCase())) return false
    if (filtroTecnologia && s.tecnologia !== filtroTecnologia) return false
    if (filtroSector && s.sector !== filtroSector) return false
    if (filtroReto && s.reto !== filtroReto) return false
    if (filtroMaterial && s.material !== filtroMaterial) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginatedItems = filtered.slice((pagina - 1) * ITEMS_PER_PAGE, pagina * ITEMS_PER_PAGE)

  return (
    <>
      {/* ─── LISTADO DE SOLUCIONES ────────────────────────────── */}
      <section id="soluciones" className="bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">

          {/* Barra de búsqueda */}
          <div className="flex items-stretch border border-[#DFDFDF] rounded-lg overflow-hidden shadow-sm bg-[#F9F9F8] mb-3">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPagina(1) }}
              placeholder="Buscar por texto..."
              className="flex-1 px-5 py-4 text-sm focus:outline-none bg-[#F9F9F8] text-gray-800 placeholder-gray-400 min-w-0"
            />
            <button className="px-8 py-4 bg-black hover:bg-gray-700 text-white text-sm  transition-colors whitespace-nowrap flex-shrink-0">
              Buscar
            </button>
          </div>

          {/* Filtros dropdown */}
          <div className="flex items-stretch border border-[#DFDFDF] rounded-lg bg-[#F9F9F8] mb-12">
            <select
              value={filtroTecnologia}
              onChange={(e) => { setFiltroTecnologia(e.target.value); setPagina(1) }}
              className="flex-1 text-sm text-gray-500 bg-transparent focus:outline-none cursor-pointer px-5 py-4 border-r border-[#DFDFDF] appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '32px' }}
            >
              <option value="">Tecnología habilitadora</option>
              {filterOptions.tecnologia.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={filtroSector}
              onChange={(e) => { setFiltroSector(e.target.value); setPagina(1) }}
              className="flex-1 text-sm text-gray-500 bg-transparent focus:outline-none cursor-pointer px-5 py-4 border-r border-[#DFDFDF] appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '32px' }}
            >
              <option value="">Sector</option>
              {filterOptions.sector.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={filtroReto}
              onChange={(e) => { setFiltroReto(e.target.value); setPagina(1) }}
              className="flex-1 text-sm text-gray-500 bg-transparent focus:outline-none cursor-pointer px-5 py-4 border-r border-[#DFDFDF] appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '32px' }}
            >
              <option value="">Reto que soluciona</option>
              {filterOptions.reto.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <select
              value={filtroMaterial}
              onChange={(e) => { setFiltroMaterial(e.target.value); setPagina(1) }}
              className="flex-1 text-sm text-gray-500 bg-transparent focus:outline-none cursor-pointer px-5 py-4 appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '32px' }}
            >
              <option value="">Tipo de material</option>
              {filterOptions.material.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {/* Contenido: sidebar texto + grid de tarjetas */}
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex gap-12">

            {/* Sidebar izquierda con texto descriptivo */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h2 className="text-2xl  text-gray-900 leading-snug mb-4">
                  Soluciones<br />
                  tecnológicas<br />
                  para la industria
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  En esta sección de MarketTech se recopilan soluciones
                  tecnológicas y materiales innovadores que pueden aplicarse
                  en los sectores del plástico y el calzado.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Las fichas incluidas en esta base de datos presentan
                  ejemplos de tecnologías emergentes, materiales avanzados y
                  aplicaciones industriales que contribuyen a mejorar los
                  procesos productivos, optimizar el uso de recursos y
                  desarrollar productos más sostenibles.
                </p>
              </div>
            </div>

            {/* Grid de soluciones */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <p className="text-center text-gray-400 py-20">Cargando soluciones...</p>
              ) : paginatedItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedItems.map((sol, idx) => (
                    <Link
                      key={sol._id}
                      href={`/markettech/${sol.slug}`}
                      className="group"
                    >
                    <article
                      className="bg-[#F9F9F8] rounded-md border border-[#DFDFDF] hover:shadow-lg transition-all h-full flex flex-col p-5"
                    >
                      {/* Icono hoja alternando naranja/púrpura */}
                      <div className="mb-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{
                            backgroundColor: idx % 2 === 0 ? '#FFE8D6' : '#F0DDF5',
                          }}
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <path d="M5 21C5.5 16.5 7.5 13 12 11" stroke={idx % 2 === 0 ? '#FF5B00' : '#5E0360'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9.00033 18C15.2183 18 19.5003 14.712 20.0003 6V4H15.9863C6.98633 4 4.00033 8 3.98633 13C3.98633 14 3.98633 16 5.98633 18H8.98633H9.00033Z" stroke={idx % 2 === 0 ? '#FF5B00' : '#5E0360'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>

                      {/* Título */}
                      <h3 className=" text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                        {sol.title}
                      </h3>

                      {/* Descripción */}
                      <p className="text-sm text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                        {sol.description}
                      </p>

                      {/* Reto + Material */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        <span className="text-[10px] text-gray-400 px-2 py-0.5 bg-gray-100 rounded-full">{sol.reto}</span>
                        <span className="text-[10px] text-gray-400 px-2 py-0.5 bg-gray-100 rounded-full">{sol.material}</span>
                      </div>

                      {/* Ver más */}
                      <div className="mt-auto pt-4">
                        <span className="inline-flex items-center gap-1 text-sm  text-orange-600 group-hover:text-orange-700 transition-colors">
                          Ver más
                          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </article>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-20">No se encontraron soluciones con estos filtros.</p>
              )}

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-14">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => { setPagina(p); document.getElementById('soluciones')?.scrollIntoView({ behavior: 'smooth' }) }}
                      className={`w-10 h-10 rounded-full text-sm  transition-colors ${
                        p === pagina
                          ? 'bg-orange-500 text-white'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
