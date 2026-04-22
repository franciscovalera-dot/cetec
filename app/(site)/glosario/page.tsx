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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl  text-gray-900 leading-tight">
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
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 rounded-md border border-[#DFDFDF] p-6" style={{ backgroundColor: '#F9F9F8' }}>

              {/* Temática */}
              <div>
                <h3 className="text-xs uppercase tracking-widest mb-5" style={{ color: '#333', fontWeight: 600 }}>Temática</h3>
                <ul>
                  {TEMATICAS.map((t) => {
                    const active = tematica === t.value
                    return (
                      <li key={t.value}>
                        <Link
                          href={{ pathname: '/glosario', query: { ...(sector ? { sector } : {}), ...(query ? { q: query } : {}), ...(active ? {} : { tematica: t.value }) } }}
                          className="block text-sm py-2.5 pl-4 transition-colors"
                          style={{ borderLeft: active ? '3px solid #E8622A' : '2px solid #E0E0E0', color: active ? '#E8622A' : '#9E9E9E', fontWeight: active ? 600 : 400 }}
                        >
                          {t.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Sector */}
              <div className="mt-12">
                <h3 className="text-xs uppercase tracking-widest mb-5" style={{ color: '#333', fontWeight: 600 }}>Sector</h3>
                <ul>
                  {SECTORES.map((s) => {
                    const active = sector === s.value
                    return (
                      <li key={s.value}>
                        <Link
                          href={{ pathname: '/glosario', query: { ...(tematica ? { tematica } : {}), ...(query ? { q: query } : {}), ...(active ? {} : { sector: s.value }) } }}
                          className="block text-sm py-2.5 pl-4 transition-colors"
                          style={{ borderLeft: active ? '3px solid #E8622A' : '2px solid #E0E0E0', color: active ? '#E8622A' : '#9E9E9E', fontWeight: active ? 600 : 400 }}
                        >
                          {s.label}
                        </Link>
                      </li>
                    )
                  })}
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
              <div className="flex items-stretch border border-[#DFDFDF] rounded-md overflow-hidden shadow-sm bg-[#F9F9F8]">
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Buscar término..."
                  className="flex-1 px-4 py-4 text-sm focus:outline-none bg-[#F9F9F8] text-gray-800 placeholder-gray-400 min-w-0"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-black hover:bg-gray-700 text-white text-sm  transition-colors whitespace-nowrap flex-shrink-0"
                >
                  Buscar
                </button>
              </div>
            </form>

            {/* Resultados */}
            {terms.length > 0 ? (
              <div className="bg-[#F9F9F8] border border-[#DFDFDF] rounded-xl overflow-hidden">
                {terms.map((term) => (
                  <div
                    key={term._id}
                    id={term.slug.current}
                    className="flex gap-6 px-6 py-4 border-b border-[#DFDFDF] last:border-b-0 hover:bg-gray-100 transition-colors"
                  >
                    {/* Término */}
                    <div className="w-48 flex-shrink-0 pt-0.5">
                      <span className=" text-sm text-gray-900 leading-snug">{term.term}</span>
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
