/**
 * PÁGINA DE GLOSARIO
 * Sidebar: Temática + Sector (igual que otras páginas)
 * Barra superior: búsqueda por texto
 * Resultados: lista término | definición
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { getGlossaryTerms } from '@/lib/sanity'
import PortableTextRenderer from '@/components/PortableTextRenderer'

export const revalidate = 60
export const metadata: Metadata = { title: 'Glosario' }

const TEMATICAS = [
  { value: 'materiales',    label: 'Materiales' },
  { value: 'procesos',      label: 'Procesos' },
  { value: 'digitalizacion',label: 'Digitalización' },
  { value: 'reciclado',     label: 'Reciclado' },
  { value: 'ecodiseno',     label: 'Ecodiseño' },
]

const SECTORES = [
  { value: 'plastico',       label: 'Plástico' },
  { value: 'calzado',        label: 'Calzado' },
  { value: 'agroalimentario',label: 'Agroalimentario' },
]

interface Props {
  searchParams: { q?: string; tematica?: string; sector?: string }
}

export default async function GlosarioPage({ searchParams }: Props) {
  const { q = '', tematica, sector } = searchParams
  const query = q.trim()

  const allTerms = await getGlossaryTerms()

  // Filtrar
  let terms = allTerms
  if (tematica) terms = terms.filter((t) => t.tematica === tematica)
  if (sector)   terms = terms.filter((t) => t.sector === sector)
  if (query)    terms = terms.filter((t) =>
    t.term.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
          <p className="text-sm text-gray-400 tracking-widest uppercase mb-4">Observatorio Tecnológico CETEC</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Glosario de términos<br />tecnológicos
          </h1>
          <p className="mt-5 text-gray-500 max-w-2xl mx-auto leading-relaxed">
            El glosario del Observatorio Tecnológico de CETEC reúne definiciones de términos clave relacionados con la innovación, los materiales, los procesos industriales y las tecnologías aplicadas a los sectores del plástico y el calzado.
          </p>
        </div>
      </section>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-10">

          {/* ─── SIDEBAR ────────────────────────────────────────── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-8 bg-gray-50 rounded-xl p-4">

              {/* Temática */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Temática</h3>
                <ul className="space-y-0.5">
                  {TEMATICAS.map((t) => (
                    <li key={t.value}>
                      <Link
                        href={{ pathname: '/glosario', query: { ...(sector ? { sector } : {}), ...(query ? { q: query } : {}), ...(tematica === t.value ? {} : { tematica: t.value }) } }}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${tematica === t.value ? 'text-orange-600 font-semibold bg-orange-50' : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'}`}
                      >
                        {t.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sector */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Sector</h3>
                <ul className="space-y-0.5">
                  {SECTORES.map((s) => (
                    <li key={s.value}>
                      <Link
                        href={{ pathname: '/glosario', query: { ...(tematica ? { tematica } : {}), ...(query ? { q: query } : {}), ...(sector === s.value ? {} : { sector: s.value }) } }}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${sector === s.value ? 'text-orange-600 font-semibold bg-orange-50' : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'}`}
                      >
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </aside>

          {/* ─── ÁREA PRINCIPAL ─────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Barra de búsqueda */}
            <form action="/glosario" method="GET" className="mb-8">
              {tematica && <input type="hidden" name="tematica" value={tematica} />}
              {sector   && <input type="hidden" name="sector"   value={sector} />}
              <div className="flex items-stretch border border-gray-200 rounded-md overflow-hidden shadow-sm bg-gray-50">
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Buscar término..."
                  className="flex-1 px-4 py-4 text-sm focus:outline-none bg-gray-50 text-gray-800 placeholder-gray-400 min-w-0"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold transition-colors whitespace-nowrap flex-shrink-0"
                >
                  Buscar
                </button>
              </div>
            </form>

            {/* Resultados */}
            {terms.length > 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                {terms.map((term) => (
                  <div
                    key={term._id}
                    id={term.slug.current}
                    className="flex gap-6 px-6 py-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-100 transition-colors"
                  >
                    {/* Término */}
                    <div className="w-48 flex-shrink-0 pt-0.5">
                      <span className="font-semibold text-sm text-gray-900 leading-snug">{term.term}</span>
                      {term.category && (
                        <span className="block text-xs text-orange-500 mt-0.5">{term.category.name}</span>
                      )}
                    </div>

                    {/* Definición */}
                    <div className="flex-1 text-sm text-gray-600 leading-relaxed min-w-0">
                      <PortableTextRenderer value={term.definition} />
                      {term.relatedTerms && term.relatedTerms.length > 0 && (
                        <div className="mt-2 flex items-center gap-1.5 flex-wrap text-xs text-gray-400">
                          <span>Ver también:</span>
                          {term.relatedTerms.map((rt) => (
                            <a key={rt.slug.current} href={`#${rt.slug.current}`} className="text-orange-500 hover:underline">
                              {rt.term}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <p className="text-gray-400 text-sm">No se encontraron términos.</p>
              </div>
            )}

            {/* Recuento */}
            {terms.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  <strong className="text-gray-700">{terms.length}</strong> término{terms.length !== 1 ? 's' : ''}
                  {query    && ` para "${query}"`}
                  {tematica && ` · ${TEMATICAS.find(t => t.value === tematica)?.label}`}
                  {sector   && ` · ${SECTORES.find(s => s.value === sector)?.label}`}
                </span>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}
