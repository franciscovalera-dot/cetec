/**
 * PÁGINA DE BÚSQUEDA
 * Barra superior: texto + tecnología + sector + botón negro todo en una sola pieza
 * Sidebar: rango de fechas con inputs date + select de idioma + botón buscar
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { searchContent, getAllContent } from '@/lib/sanity'
import AlertModal from '@/components/AlertModal'
import FiltersDrawer from '@/components/FiltersDrawer'

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

interface Props {
  searchParams: {
    q?: string
    tematica?: string
    sector?: string
    dateFrom?: string
    dateTo?: string
    idioma?: string
    page?: string
  }
}

const ITEMS_PER_PAGE = 12

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
  const { q = '', tematica, sector, dateFrom, dateTo, idioma, page } = searchParams
  const query = q.trim()
  const currentPage = Math.max(1, parseInt(page || '1', 10))

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

    // Excluir glosario y markettech (no tienen página de detalle navegable
    // para posts). Eventos sí van a /agenda/[slug] (nueva página de detalle).
    results = results.filter((r) => r.seccion !== 'glosario' && r.seccion !== 'markettech')

    if (tematica) results = results.filter((r) => r.tematica === tematica)
    if (sector)   results = results.filter((r) => r.sector === sector)
    if (idioma)   results = results.filter((r) => (r.idioma || 'es') === idioma)
    if (dateFrom) results = results.filter((r) => !r.date || r.date >= dateFrom)
    if (dateTo)   results = results.filter((r) => !r.date || r.date <= dateTo + 'T23:59:59')
  }

  const totalResults = results.length
  const totalPages = Math.max(1, Math.ceil(totalResults / ITEMS_PER_PAGE))
  const pageSafe = Math.min(currentPage, totalPages)
  const paginatedResults = results.slice((pageSafe - 1) * ITEMS_PER_PAGE, pageSafe * ITEMS_PER_PAGE)

  function buildPageHref(p: number) {
    const params: Record<string, string> = {}
    if (query)    params.q = query
    if (tematica) params.tematica = tematica
    if (sector)   params.sector = sector
    if (dateFrom) params.dateFrom = dateFrom
    if (dateTo)   params.dateTo = dateTo
    if (idioma)   params.idioma = idioma
    if (p > 1)    params.page = String(p)
    const qs = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
    return qs ? `/busqueda?${qs}` : '/busqueda'
  }

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

              <div className="sticky top-24 border border-[#DFDFDF] shadow-md rounded-xl p-5 space-y-6" style={{ backgroundColor: '#F9F9F8' }}>

                {/* Incorporado entre */}
                <div>
                  <label className="text-sm  text-gray-700 block mb-3">
                    Incorporado entre
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      name="dateFrom"
                      defaultValue={dateFrom || ''}
                      className="w-0 flex-1 min-w-0 px-2 py-1.5 text-xs border border-[#DFDFDF] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700"
                      style={{ backgroundColor: '#F9F9F8' }}
                    />
                    <input
                      type="date"
                      name="dateTo"
                      defaultValue={dateTo || ''}
                      className="w-0 flex-1 min-w-0 px-2 py-1.5 text-xs border border-[#DFDFDF] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700"
                      style={{ backgroundColor: '#F9F9F8' }}
                    />
                  </div>
                </div>

                {/* Idioma */}
                <div>
                  <label className="text-sm  text-gray-700 block mb-3">
                    Idioma
                  </label>
                  <select
                    name="idioma"
                    defaultValue={idioma || ''}
                    className="w-full px-3 py-2 text-sm border border-[#DFDFDF] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 cursor-pointer"
                    style={{ backgroundColor: '#F9F9F8' }}
                  >
                    {IDIOMAS.map((i) => (
                      <option key={i.value} value={i.value}>{i.label}</option>
                    ))}
                  </select>
                </div>

                {/* Botón buscar */}
                <button
                  type="submit"
                  className="w-full py-2.5 bg-black hover:bg-gray-800 text-white text-sm rounded-lg transition-colors"
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

              <div className="flex flex-col md:flex-row items-stretch border border-[#DFDFDF] rounded-md overflow-hidden shadow-sm divide-y md:divide-y-0 md:divide-x divide-gray-200" style={{ backgroundColor: '#F9F9F8' }}>
                {/* Input de texto */}
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Busca por texto..."
                  className="flex-1 px-4 py-4 text-sm focus:outline-none text-gray-800 placeholder-gray-400 min-w-0"
                  style={{ backgroundColor: '#F9F9F8' }}
                />

                {/* Tecnología */}
                <div className="relative md:w-44 md:flex-shrink-0 flex items-center">
                  <select
                    name="tematica"
                    defaultValue={tematica || ''}
                    className="w-full pl-4 pr-8 py-4 text-sm focus:outline-none cursor-pointer border-none appearance-none"
                    style={{ color: '#878787', backgroundColor: '#F9F9F8' }}
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

                {/* Sector */}
                <div className="relative md:w-44 md:flex-shrink-0 flex items-center">
                  <select
                    name="sector"
                    defaultValue={sector || ''}
                    className="w-full pl-4 pr-8 py-4 text-sm focus:outline-none cursor-pointer border-none appearance-none"
                    style={{ color: '#878787', backgroundColor: '#F9F9F8' }}
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

                {/* Botón negro — en móvil ocupa todo el ancho, en desktop se alinea a la derecha */}
                <button
                  type="submit"
                  className="px-8 py-4 bg-black hover:bg-gray-700 text-white text-sm transition-colors whitespace-nowrap md:flex-shrink-0"
                >
                  Buscar
                </button>
              </div>
            </form>

            {/* Botón Filtros (sólo móvil/tablet — el sidebar es lg:block) */}
            <FiltersDrawer
              query={query || undefined}
              tematica={tematica}
              sector={sector}
              dateFrom={dateFrom}
              dateTo={dateTo}
              idioma={idioma}
            />

            {/* Encabezado resultados */}
            {query && (
              <div className="flex items-baseline gap-3 mb-6">
                <h2 className="text-lg  text-gray-900">Resultados</h2>
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
            {paginatedResults.length > 0 && (
              <div className="rounded-xl p-6" style={{ backgroundColor: '#F9F9F8' }}>
                <h2 className="text-lg text-gray-900 mb-4">Resultados</h2>
                <div className="space-y-2">
                  {paginatedResults.map((r) => {
                    const dateStr = r.date
                      ? new Date(r.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
                      : null

                    const content = (
                      <article className="flex items-center gap-5 px-5 py-3 bg-white border border-[#DFDFDF] rounded-lg hover:border-gray-300 transition-colors">
                        {/* Fecha */}
                        {dateStr ? (
                          <time className="text-xs text-gray-400 flex-shrink-0 w-20">{dateStr}</time>
                        ) : (
                          <div className="w-20 flex-shrink-0" />
                        )}

                        {/* Título */}
                        <p className="flex-1 text-sm text-gray-700 line-clamp-1 min-w-0">
                          {r.title}
                        </p>
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

                {/* Footer: recuento + paginación + crear alerta */}
                <div className="flex items-center justify-between gap-3 mt-6 text-xs text-gray-500">
                  <div className="flex items-center gap-3 sm:gap-5">
                    <span className="whitespace-nowrap">
                      Resultados: <span className="text-gray-700">{totalResults}</span>
                    </span>
                    {totalPages > 1 && (
                      <span className="flex items-center gap-2 sm:gap-3">
                        <span className="whitespace-nowrap">Página {pageSafe} de {totalPages}</span>
                        {pageSafe < totalPages && (
                          <Link
                            href={buildPageHref(pageSafe + 1)}
                            className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap"
                          >
                            Siguiente
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        )}
                      </span>
                    )}
                  </div>

                  <AlertModal
                    query={query || undefined}
                    tematica={tematica}
                    sector={sector}
                    idioma={idioma}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
