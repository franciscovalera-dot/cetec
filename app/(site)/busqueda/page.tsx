/**
 * PÁGINA DE BÚSQUEDA
 * Búsqueda global en todos los tipos de contenido vía GROQ
 * Usa searchParams para obtener la query del URL (?q=término)
 */
import { Metadata } from 'next'
import Link from 'next/link'
import { searchContent } from '@/lib/sanity'
import PostCard from '@/components/PostCard'

export const revalidate = 60

interface SearchPageProps {
  searchParams: { q?: string }
}

export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  const query = searchParams.q
  return {
    title: query ? `Resultados para "${query}"` : 'Búsqueda',
    description: 'Busca artículos, eventos, documentos y términos del glosario.',
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim() || ''

  // Solo buscar si hay un término de búsqueda
  const results = query ? await searchContent(query) : null

  // Contar resultados totales
  const totalResults = results
    ? results.posts.length +
      results.events.length +
      results.documents.length +
      results.glossary.length
    : 0

  return (
    <>
      {/* Hero con formulario de búsqueda */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold">Búsqueda</h1>
          <p className="mt-4 text-lg text-gray-300">
            Encuentra artículos, eventos, documentos y términos del glosario.
          </p>

          {/* Formulario de búsqueda prominente */}
          <form
            action="/busqueda"
            method="GET"
            className="mt-8 max-w-2xl"
          >
            <div className="flex">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="¿Qué estás buscando?"
                className="flex-1 px-6 py-4 text-lg text-gray-900 bg-white rounded-l-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                autoFocus
              />
              <button
                type="submit"
                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-r-xl transition-colors"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ─── RESULTADOS DE BÚSQUEDA ─────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Estado: sin búsqueda */}
        {!query && (
          <div className="text-center py-20">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-gray-500 text-lg">
              Introduce un término de búsqueda para empezar.
            </p>
          </div>
        )}

        {/* Estado: búsqueda sin resultados */}
        {query && totalResults === 0 && (
          <div className="text-center py-20">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
              />
            </svg>
            <p className="text-gray-500 text-lg">
              No se encontraron resultados para{' '}
              <strong className="text-gray-700">&ldquo;{query}&rdquo;</strong>
            </p>
            <p className="text-gray-400 mt-2">
              Intenta con otros términos o revisa la ortografía.
            </p>
          </div>
        )}

        {/* Resultados encontrados */}
        {results && totalResults > 0 && (
          <>
            {/* Resumen de resultados */}
            <p className="text-sm text-gray-500 mb-8">
              Se encontraron{' '}
              <strong className="text-gray-700">{totalResults}</strong>{' '}
              resultados para{' '}
              <strong className="text-gray-700">&ldquo;{query}&rdquo;</strong>
            </p>

            {/* ── ARTÍCULOS ──────────────────────────────────── */}
            {results.posts.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-orange-500 rounded-full" />
                  Artículos
                  <span className="text-sm font-normal text-gray-500">
                    ({results.posts.length})
                  </span>
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              </section>
            )}

            {/* ── EVENTOS DE AGENDA ──────────────────────────── */}
            {results.events.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-500 rounded-full" />
                  Eventos
                  <span className="text-sm font-normal text-gray-500">
                    ({results.events.length})
                  </span>
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {results.events.map((event) => (
                    <Link
                      key={event._id}
                      href={`/agenda#${event.slug.current}`}
                      className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      {/* Indicador de fecha */}
                      <div className="w-14 h-14 bg-blue-50 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-600 uppercase">
                          {new Date(event.date).toLocaleDateString('es-ES', {
                            month: 'short',
                          })}
                        </span>
                        <span className="text-xl font-bold text-blue-700 leading-none">
                          {new Date(event.date).getDate()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {event.title}
                        </h3>
                        {event.location && (
                          <p className="text-sm text-gray-500 mt-0.5">
                            {event.location}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ── DOCUMENTOS ─────────────────────────────────── */}
            {results.documents.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-500 rounded-full" />
                  Documentos
                  <span className="text-sm font-normal text-gray-500">
                    ({results.documents.length})
                  </span>
                </h2>
                <div className="space-y-3">
                  {results.documents.map((doc) => (
                    <a
                      key={doc._id}
                      href={doc.file?.asset?.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all"
                    >
                      {/* Icono de tipo de archivo */}
                      <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-green-700 uppercase">
                          {doc.fileType || 'DOC'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-1">
                          {doc.title}
                        </h3>
                        {doc.description && (
                          <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
                            {doc.description}
                          </p>
                        )}
                      </div>
                      {/* Icono de descarga */}
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* ── GLOSARIO ───────────────────────────────────── */}
            {results.glossary.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-purple-500 rounded-full" />
                  Glosario
                  <span className="text-sm font-normal text-gray-500">
                    ({results.glossary.length})
                  </span>
                </h2>
                <div className="space-y-3">
                  {results.glossary.map((term) => (
                    <Link
                      key={term._id}
                      href={`/glosario#${term.slug.current}`}
                      className="group block p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                        {term.term}
                      </h3>
                      {term.category && (
                        <span className="text-xs text-purple-500 mt-1 inline-block">
                          {term.category.name}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </>
  )
}
