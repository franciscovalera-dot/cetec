/**
 * PÁGINA DE BÚSQUEDA
 * Barra superior: texto + tecnología + sector + botón negro todo en una sola pieza
 * Sidebar: rango de fechas con inputs date + select de idioma + botón buscar
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { searchContent, getAllContent } from '@/lib/sanity'

export const revalidate = 60

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

const IDIOMAS = [
  { value: '', label: 'Todos' },
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
]

const SECCION_LABELS: Record<string, string> = {
  noticias: 'Noticias',
  normativa: 'Normativa',
  formacion: 'Formación',
  ayudas: 'Ayudas',
  agenda: 'Agenda',
  documentos: 'Documentos',
  glosario: 'Glosario',
  markettech: 'MarketTech',
}

const SECCION_GRADIENTS: Record<string, string> = {
  noticias: 'linear-gradient(90deg, #5E0360 0%, #C98BCB 100%)',
  normativa: 'linear-gradient(90deg, #1d4ed8 0%, #93c5fd 100%)',
  formacion: 'linear-gradient(90deg, #15803d 0%, #86efac 100%)',
  ayudas: 'linear-gradient(90deg, #b45309 0%, #fcd34d 100%)',
  agenda: 'linear-gradient(90deg, #0e7490 0%, #67e8f9 100%)',
  documentos: 'linear-gradient(90deg, #7c3aed 0%, #c4b5fd 100%)',
  glosario: 'linear-gradient(90deg, #be185d 0%, #f9a8d4 100%)',
  markettech: 'linear-gradient(90deg, #FF813B 0%, #FFD4B8 100%)',
}

interface Props {
  searchParams: {
    q?: string
    tematica?: string
    sector?: string
    dateFrom?: string
    dateTo?: string
    idioma?: string
  }
}

export function generateMetadata({ searchParams }: Props): Metadata {
  const q = searchParams.q
  return {
    title: q ? `Resultados para "${q}"` : 'Búsqueda',
    description: 'Busca artículos, normativa, documentos, eventos y más.',
  }
}

type SearchResult = {
  _id: string
  title: string
  href: string
  date: string
  seccion: string
  excerpt?: string
  tematica?: string
  sector?: string
  idioma?: string
  isExternal?: boolean
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '', tematica, sector, dateFrom, dateTo, idioma } = searchParams
  const query = q.trim()

  const raw = query ? await searchContent(query) : await getAllContent()

  let results: SearchResult[] = []

  if (raw) {
    const posts: SearchResult[] = raw.posts.map((p) => ({
      _id: p._id,
      title: p.title,
      href: `/${p.seccion || 'noticias'}/${p.slug.current}`,
      date: p.publishedAt,
      seccion: p.seccion || 'noticias',
      excerpt: p.excerpt,
      tematica: p.tematica,
      sector: p.sector,
      idioma: p.idioma,
    }))

    const events: SearchResult[] = raw.events.map((e) => ({
      _id: e._id,
      title: e.title,
      href: `/agenda/${e.slug.current}`,
      date: e.date,
      seccion: 'agenda',
      excerpt: e.location,
    }))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const docs: SearchResult[] = raw.documents.map((d: any) => ({
      _id: d._id,
      title: d.title,
      href: d.file?.asset?.url || '#',
      date: d.date || '',
      seccion: 'documentos',
      excerpt: d.description,
      isExternal: true,
    }))

    const glossary: SearchResult[] = raw.glossary.map((g) => ({
      _id: g._id,
      title: g.term,
      href: `/glosario#${g.slug.current}`,
      date: '',
      seccion: 'glosario',
      excerpt: g.category?.name,
    }))

    results = [...posts, ...events, ...docs, ...glossary]
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

    if (tematica) results = results.filter((r) => r.tematica === tematica)
    if (sector)   results = results.filter((r) => r.sector === sector)
    if (idioma)   results = results.filter((r) => (r.idioma || 'es') === idioma)
    if (dateFrom) results = results.filter((r) => !r.date || r.date >= dateFrom)
    if (dateTo)   results = results.filter((r) => !r.date || r.date <= dateTo + 'T23:59:59')
  }

  const totalResults = results.length

  return (
    <>
      {/* Contenido: sidebar + área principal */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-10">

          {/* ─── SIDEBAR ────────────────────────────────────────── */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <form action="/busqueda" method="GET">
              {/* Preservar filtros de la barra superior */}
              {query    && <input type="hidden" name="q"        value={query} />}
              {tematica && <input type="hidden" name="tematica" value={tematica} />}
              {sector   && <input type="hidden" name="sector"   value={sector} />}

              <div className="sticky top-24 bg-gray-50 border border-gray-200 shadow-md rounded-xl p-5 space-y-6">

                {/* Incorporado entre */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-3">
                    Incorporado entre
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      name="dateFrom"
                      defaultValue={dateFrom || ''}
                      className="w-0 flex-1 min-w-0 px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700"
                    />
                    <input
                      type="date"
                      name="dateTo"
                      defaultValue={dateTo || ''}
                      className="w-0 flex-1 min-w-0 px-2 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700"
                    />
                  </div>
                </div>

                {/* Idioma */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-3">
                    Idioma
                  </label>
                  <select
                    name="idioma"
                    defaultValue={idioma || ''}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 cursor-pointer"
                  >
                    {IDIOMAS.map((i) => (
                      <option key={i.value} value={i.value}>{i.label}</option>
                    ))}
                  </select>
                </div>

                {/* Botón buscar */}
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Buscar
                </button>

              </div>
            </form>
          </aside>

          {/* ─── ÁREA PRINCIPAL ─────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* ── Barra de búsqueda: una sola pieza conectada ── */}
            <form action="/busqueda" method="GET" className="mb-8">
              {/* Preservar filtros del sidebar */}
              {dateFrom && <input type="hidden" name="dateFrom" value={dateFrom} />}
              {dateTo   && <input type="hidden" name="dateTo"   value={dateTo} />}
              {idioma   && <input type="hidden" name="idioma"   value={idioma} />}

              <div className="flex items-stretch border border-gray-200 rounded-md overflow-hidden shadow-sm bg-gray-50">
                {/* Input de texto */}
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Busca por texto..."
                  className="flex-1 px-4 py-4 text-sm focus:outline-none bg-gray-50 text-gray-800 placeholder-gray-400 min-w-0"
                />

                {/* Separador */}
                <div className="w-px bg-gray-200 self-stretch" />

                {/* Tecnología */}
                <div className="relative w-44 flex-shrink-0 flex items-center">
                  <select
                    name="tematica"
                    defaultValue={tematica || ''}
                    className="w-full pl-4 pr-8 py-4 text-sm bg-gray-50 focus:outline-none cursor-pointer border-none appearance-none"
                    style={{ color: '#878787' }}
                  >
                    <option value="">Tecnología</option>
                    {TEMATICAS.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <svg className="absolute right-3 w-3.5 h-3.5 pointer-events-none" style={{ color: '#878787' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Separador */}
                <div className="w-px bg-gray-200 self-stretch" />

                {/* Sector */}
                <div className="relative w-44 flex-shrink-0 flex items-center">
                  <select
                    name="sector"
                    defaultValue={sector || ''}
                    className="w-full pl-4 pr-8 py-4 text-sm bg-gray-50 focus:outline-none cursor-pointer border-none appearance-none"
                    style={{ color: '#878787' }}
                  >
                    <option value="">Sector</option>
                    {SECTORES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <svg className="absolute right-3 w-3.5 h-3.5 pointer-events-none" style={{ color: '#878787' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Botón negro — dentro del mismo contenedor, sin border-radius propio */}
                <button
                  type="submit"
                  className="px-8 py-4 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold transition-colors whitespace-nowrap flex-shrink-0"
                >
                  Buscar
                </button>
              </div>
            </form>

            {/* Encabezado resultados */}
            {query && (
              <div className="flex items-baseline gap-3 mb-6">
                <h2 className="text-lg font-bold text-gray-900">Resultados</h2>
                <span className="text-sm text-gray-400">
                  {totalResults > 0
                    ? `${totalResults} resultado${totalResults !== 1 ? 's' : ''} para "${query}"`
                    : `Sin resultados para "${query}"`}
                </span>
              </div>
            )}

            {/* Estado: sin resultados */}
            {query && totalResults === 0 && (
              <div className="text-center py-24">
                <p className="text-gray-400 text-sm">No se encontraron resultados. Prueba con otros términos.</p>
              </div>
            )}

            {/* Lista de resultados */}
            {results.length > 0 && (
              <>
                <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                  {results.map((r) => {
                    const dateStr = r.date
                      ? new Date(r.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
                      : null
                    const gradient = SECCION_GRADIENTS[r.seccion] || SECCION_GRADIENTS.noticias
                    const label    = SECCION_LABELS[r.seccion] || r.seccion

                    const content = (
                      <article className="flex items-center gap-4 px-5 py-3 bg-gray-50 hover:bg-gray-100 border-b border-gray-200 last:border-b-0 transition-colors">
                        {/* Fecha */}
                        {dateStr ? (
                          <time className="text-xs text-gray-400 flex-shrink-0 w-20">{dateStr}</time>
                        ) : (
                          <div className="w-20 flex-shrink-0" />
                        )}

                        {/* Badge sección */}
                        <span
                          className="text-[10px] font-semibold text-white px-2.5 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: gradient }}
                        >
                          {label}
                        </span>

                        {/* Título */}
                        <p className="flex-1 text-sm text-gray-800 group-hover:text-gray-900 line-clamp-1 min-w-0">
                          {r.title}
                        </p>

                        {/* Flecha */}
                        <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </article>
                    )

                    return r.isExternal ? (
                      <a key={r._id} href={r.href} target="_blank" rel="noopener noreferrer" className="group block">
                        {content}
                      </a>
                    ) : (
                      <Link key={r._id} href={r.href} className="group block">
                        {content}
                      </Link>
                    )
                  })}
                </div>

                {/* Footer: recuento */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    <strong className="text-gray-700">{totalResults}</strong> resultado{totalResults !== 1 ? 's' : ''}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
