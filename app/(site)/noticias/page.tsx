/**
 * PÁGINA DE NOTICIAS — Layout con sidebar de filtros + grid de cards
 * Filtros: Temática y Sector como sidebar vertical a la izquierda
 */
import { getPostsBySeccion } from '@/lib/sanity'
import Link from 'next/link'
import type { Post } from '@/lib/sanity'
import Pagination from '@/components/Pagination'
import SectionSearch from '@/components/SectionSearch'

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
  searchParams: { tematica?: string; sector?: string; page?: string; q?: string; date?: string }
}

function dateCutoff(code?: string): Date | null {
  if (!code) return null
  const now = new Date()
  const cutoff = new Date(now)
  if (code === '1m') cutoff.setMonth(cutoff.getMonth() - 1)
  else if (code === '3m') cutoff.setMonth(cutoff.getMonth() - 3)
  else if (code === '6m') cutoff.setMonth(cutoff.getMonth() - 6)
  else if (code === '1y') cutoff.setFullYear(cutoff.getFullYear() - 1)
  else return null
  return cutoff
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
              className="text-[11px]  text-white px-3 py-1 rounded-full"
              style={{ background: 'linear-gradient(90deg, #FF813B 0%, #FFD4B8 100%)' }}
            >
              {sectorLabel}
            </span>
          )}
          <span
            className="text-[11px]  text-white px-3 py-1 rounded-full"
            style={{ background: 'linear-gradient(90deg, #5E0360 0%, #C98BCB 100%)' }}
          >
            {seccionLabel}
          </span>
        </div>

        {/* Título con icono delante */}
        <h3 className=" text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-3 leading-snug">
          <svg className="inline-block align-[-3px] w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 18 18">
            <path d="M3.375 15.75C3.075 15.75 2.8125 15.6375 2.5875 15.4125C2.3625 15.1875 2.25 14.925 2.25 14.625V3.375C2.25 3.075 2.3625 2.8125 2.5875 2.5875C2.8125 2.3625 3.075 2.25 3.375 2.25H12.0375L15.75 5.9625V14.625C15.75 14.925 15.6375 15.1875 15.4125 15.4125C15.1875 15.6375 14.925 15.75 14.625 15.75H3.375ZM3.375 14.625H14.625V6.58931H11.4188V3.375H3.375V14.625ZM5.23125 12.5438H12.7687V11.4188H5.23125V12.5438ZM5.23125 6.58125H9V5.45625H5.23125V6.58125ZM5.23125 9.5625H12.7687V8.4375H5.23125V9.5625Z" />
          </svg>
          {post.title}
        </h3>

        {/* Fecha + extracto */}
        <p className="text-sm text-gray-500 mt-2 line-clamp-4 leading-relaxed">
          <time>{formattedDate}</time>
          {post.excerpt ? ` - ${post.excerpt}` : ''}
        </p>

        {/* Spacer + Ver más */}
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
  )
}

export default async function NoticiasPage({ searchParams }: Props) {
  const { tematica, sector, page, q, date } = searchParams
  let allPosts = await getPostsBySeccion('noticias', { tematica, sector })
  if (q) {
    const needle = q.toLowerCase()
    allPosts = allPosts.filter(
      (p) => p.title.toLowerCase().includes(needle) || (p.excerpt || '').toLowerCase().includes(needle)
    )
  }
  const cutoff = dateCutoff(date)
  if (cutoff) {
    allPosts = allPosts.filter((p) => new Date(p.publishedAt) >= cutoff)
  }
  const currentPage = Math.max(1, parseInt(page || '1', 10))
  const totalPages = Math.max(1, Math.ceil(allPosts.length / ITEMS_PER_PAGE))
  const posts = allPosts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <>
      {/* Buscador en la parte superior */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <SectionSearch basePath="/noticias" q={q} date={date} hiddenParams={{ tematica, sector }} />
        </div>
      </section>

      {/* Hero centrado */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl  text-gray-900 leading-tight">
            Noticias del sector<br />
            del plástico y el calzado
          </h1>
          <p className="mt-5 text-gray-500 max-w-2xl mx-auto leading-relaxed">
            En esta sección del Observatorio Tecnológico de CETEC se recopilan
            noticias y novedades relacionadas con la innovación, la investigación
            y el desarrollo tecnológico en los sectores del plástico y el calzado.
          </p>
        </div>
      </section>

      {/* Contenido: sidebar + grid */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-10">

          {/* ─── SIDEBAR FILTROS ────────────────────────────── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 rounded-2xl p-6" style={{ backgroundColor: '#F5F5F5' }}>
              {/* Temática */}
              <div>
                <h3 className="text-xs uppercase tracking-widest mb-5" style={{ color: '#333', fontWeight: 600 }}>
                  Temática
                </h3>
                <ul>
                  {TEMATICAS.map((t) => {
                    const active = tematica === t.value
                    return (
                      <li key={t.value}>
                        <Link
                          href={{
                            pathname: '/noticias',
                            query: {
                              ...(sector ? { sector } : {}),
                              ...(active ? {} : { tematica: t.value }),
                            },
                          }}
                          className="block text-sm py-2.5 pl-4 transition-colors"
                          style={{
                            borderLeft: active ? '3px solid #E8622A' : '2px solid #E0E0E0',
                            color: active ? '#E8622A' : '#9E9E9E',
                            fontWeight: active ? 600 : 400,
                          }}
                        >
                          {t.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Sector — separación clara respecto a Temática */}
              <div className="mt-12">
                <h3 className="text-xs uppercase tracking-widest mb-5" style={{ color: '#333', fontWeight: 600 }}>
                  Sector
                </h3>
                <ul>
                  {SECTORES.map((s) => {
                    const active = sector === s.value
                    return (
                      <li key={s.value}>
                        <Link
                          href={{
                            pathname: '/noticias',
                            query: {
                              ...(tematica ? { tematica } : {}),
                              ...(active ? {} : { sector: s.value }),
                            },
                          }}
                          className="block text-sm py-2.5 pl-4 transition-colors"
                          style={{
                            borderLeft: active ? '3px solid #E8622A' : '2px solid #E0E0E0',
                            color: active ? '#E8622A' : '#9E9E9E',
                            fontWeight: active ? 600 : 400,
                          }}
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

          {/* ─── FILTROS MOBILE (horizontal) ────────────────── */}
          <div className="lg:hidden mb-6 w-full">
            <div className="flex gap-4 overflow-x-auto pb-2">
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs  text-gray-900 uppercase">Temática:</span>
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
                <span className="text-xs  text-gray-900 uppercase">Sector:</span>
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
                  className="inline-flex items-center gap-1 mt-3 text-sm  text-orange-600 hover:text-orange-700"
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
