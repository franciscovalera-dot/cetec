/**
 * PÁGINA DE NOTICIAS — Layout con sidebar de filtros + grid de cards
 * Filtros: Temática y Sector como sidebar vertical a la izquierda
 */
import { getPostsBySeccion } from '@/lib/sanity'
import Link from 'next/link'
import type { Post } from '@/lib/sanity'
import Pagination from '@/components/Pagination'

const ITEMS_PER_PAGE = 12

export const revalidate = 60

export const metadata = {
  title: 'Noticias',
  description: 'Noticias del sector del plástico y el calzado.',
}

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

const SECCION_LABELS: Record<string, string> = {
  noticias: 'Noticias',
  normativa: 'Normativa',
  formacion: 'Formación',
  ayudas: 'Ayudas',
  agenda: 'Agenda',
  markettech: 'MarketTech',
}

const SECTOR_LABELS: Record<string, string> = {
  plastico: 'Plástico',
  calzado: 'Calzado',
  agroalimentario: 'Agroalimentario',
}

interface Props {
  searchParams: { tematica?: string; sector?: string; page?: string }
}

function PostCard({ post, seccion }: { post: Post; seccion: string }) {
  const href = `/${post.seccion || seccion}/${post.slug.current}`
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const seccionLabel = SECCION_LABELS[post.seccion || seccion] || 'Noticias'
  const sectorLabel = post.sector ? SECTOR_LABELS[post.sector] : null

  return (
    <Link href={href} className="group">
      <article className="bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all h-full flex flex-col p-5">
        {/* Badges: sector (naranja) + sección (morado) */}
        <div className="flex items-center gap-2 mb-4">
          {sectorLabel && (
            <span
              className="text-[11px] font-semibold text-white px-3 py-1 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #FF813B 0%, #FFD4B8 100%)',
              }}
            >
              {sectorLabel}
            </span>
          )}
          <span
            className="text-[11px] font-semibold text-white px-3 py-1 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #5E0360 0%, #C98BCB 100%)',
            }}
          >
            {seccionLabel}
          </span>
        </div>

        {/* Título */}
        <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
          {post.title}
        </h3>

        {/* Extracto */}
        {post.excerpt && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Fecha */}
        <time className="text-xs text-gray-400 mt-3 block">
          {formattedDate}
        </time>

        {/* Spacer + Ver más */}
        <div className="mt-auto pt-4">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 group-hover:text-orange-700 transition-colors">
            Ver más
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  )
}

export default async function NoticiasPage({ searchParams }: Props) {
  const { tematica, sector, page } = searchParams
  const allPosts = await getPostsBySeccion('noticias', { tematica, sector })
  const currentPage = Math.max(1, parseInt(page || '1', 10))
  const totalPages = Math.max(1, Math.ceil(allPosts.length / ITEMS_PER_PAGE))
  const posts = allPosts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <>
      {/* Hero centrado */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
          <p className="text-sm text-gray-400 tracking-widest uppercase mb-4">
            Observatorio Tecnológico CETEC
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Noticias del sector<br />
            del plástico y el calzado
          </h1>
          <p className="mt-5 text-gray-500 max-w-2xl mx-auto leading-relaxed">
            El observatorio tecnológico de CETEC centraliza información estratégica
            sobre materiales, procesos, sostenibilidad e innovación.
          </p>
        </div>
      </section>

      {/* Contenido: sidebar + grid */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-10">

          {/* ─── SIDEBAR FILTROS ────────────────────────────── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-8 bg-gray-50 rounded-xl p-4">
              {/* Temática */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">
                  Temática
                </h3>
                <ul className="space-y-0.5">
                  {TEMATICAS.map((t) => (
                    <li key={t.value}>
                      <Link
                        href={{
                          pathname: '/noticias',
                          query: {
                            ...(sector ? { sector } : {}),
                            ...(tematica === t.value ? {} : { tematica: t.value }),
                          },
                        }}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                          tematica === t.value
                            ? 'text-orange-600 font-semibold bg-orange-50'
                            : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                        }`}
                      >
                        {t.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sector */}
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">
                  Sector
                </h3>
                <ul className="space-y-0.5">
                  {SECTORES.map((s) => (
                    <li key={s.value}>
                      <Link
                        href={{
                          pathname: '/noticias',
                          query: {
                            ...(tematica ? { tematica } : {}),
                            ...(sector === s.value ? {} : { sector: s.value }),
                          },
                        }}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                          sector === s.value
                            ? 'text-orange-600 font-semibold bg-orange-50'
                            : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                        }`}
                      >
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* ─── FILTROS MOBILE (horizontal) ────────────────── */}
          <div className="lg:hidden mb-6 w-full">
            <div className="flex gap-4 overflow-x-auto pb-2">
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-bold text-gray-900 uppercase">Temática:</span>
                {TEMATICAS.map((t) => (
                  <Link
                    key={t.value}
                    href={{
                      pathname: '/noticias',
                      query: {
                        ...(sector ? { sector } : {}),
                        ...(tematica === t.value ? {} : { tematica: t.value }),
                      },
                    }}
                    className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                      tematica === t.value
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-bold text-gray-900 uppercase">Sector:</span>
                {SECTORES.map((s) => (
                  <Link
                    key={s.value}
                    href={{
                      pathname: '/noticias',
                      query: {
                        ...(tematica ? { tematica } : {}),
                        ...(sector === s.value ? {} : { sector: s.value }),
                      },
                    }}
                    className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                      sector === s.value
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ─── GRID DE CARDS ──────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Filtros activos */}
            {(tematica || sector) && (
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <span className="text-xs text-gray-500">Filtros activos:</span>
                {tematica && (
                  <Link
                    href={{ pathname: '/noticias', query: sector ? { sector } : {} }}
                    className="inline-flex items-center gap-1 text-xs px-3 py-1 bg-orange-50 text-orange-700 rounded-full hover:bg-orange-100 transition-colors"
                  >
                    {TEMATICAS.find((t) => t.value === tematica)?.label}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Link>
                )}
                {sector && (
                  <Link
                    href={{ pathname: '/noticias', query: tematica ? { tematica } : {} }}
                    className="inline-flex items-center gap-1 text-xs px-3 py-1 bg-orange-50 text-orange-700 rounded-full hover:bg-orange-100 transition-colors"
                  >
                    {SECTORES.find((s) => s.value === sector)?.label}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Link>
                )}
                <Link
                  href="/noticias"
                  className="text-xs text-gray-500 hover:text-orange-600 underline transition-colors"
                >
                  Limpiar todo
                </Link>
              </div>
            )}

            {posts.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <PostCard key={post._id} post={post} seccion="noticias" />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath="/noticias"
                  queryParams={{ ...(tematica ? { tematica } : {}), ...(sector ? { sector } : {}) }}
                />
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500">No hay artículos con estos filtros.</p>
                <Link
                  href="/noticias"
                  className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                  Ver todas las noticias
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
