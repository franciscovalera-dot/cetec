/**
 * PÁGINA DE AYUDAS — Subvenciones para innovación
 */
import { getPostsBySeccion } from '@/lib/sanity'
import Link from 'next/link'
import type { Post } from '@/lib/sanity'
import Pagination from '@/components/Pagination'
import SectionSearch from '@/components/SectionSearch'

const ITEMS_PER_PAGE = 12

export const revalidate = 60
export const metadata = { title: 'Ayudas y Subvenciones' }

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
const SECCION_LABELS: Record<string, string> = { noticias: 'Noticias', normativa: 'Normativa', formacion: 'Formación', ayudas: 'Ayudas', agenda: 'Agenda', markettech: 'MarketTech' }
const SECTOR_LABELS: Record<string, string> = { plastico: 'Plástico', calzado: 'Calzado', agroalimentario: 'Agroalimentario' }

interface Props { searchParams: { tematica?: string; sector?: string; page?: string; q?: string; date?: string } }

function dateCutoff(code?: string): Date | null {
  if (!code) return null
  const cutoff = new Date()
  if (code === '1m') cutoff.setMonth(cutoff.getMonth() - 1)
  else if (code === '3m') cutoff.setMonth(cutoff.getMonth() - 3)
  else if (code === '6m') cutoff.setMonth(cutoff.getMonth() - 6)
  else if (code === '1y') cutoff.setFullYear(cutoff.getFullYear() - 1)
  else return null
  return cutoff
}

function PostCard({ post }: { post: Post }) {
  const href = `/${post.seccion || 'ayudas'}/${post.slug.current}`
  const date = new Date(post.publishedAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const secLabel = SECCION_LABELS[post.seccion || 'ayudas'] || 'Ayudas'
  const sectorLabel = post.sector ? SECTOR_LABELS[post.sector] : null
  return (
    <Link href={href} className="group">
      <article className="bg-[#F9F9F8] rounded-md border border-[#DFDFDF] hover:shadow-lg transition-all h-full flex flex-col p-5">
        <div className="flex items-center gap-2 mb-4">
          {sectorLabel && <span className="text-[11px]  text-white px-3 py-1 rounded-full" style={{ background: 'linear-gradient(90deg, #FF813B 0%, #FFD4B8 100%)' }}>{sectorLabel}</span>}
          <span className="text-[11px]  text-white px-3 py-1 rounded-full" style={{ background: 'linear-gradient(90deg, #5E0360 0%, #C98BCB 100%)' }}>{secLabel}</span>
        </div>
        <h3 className=" text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-3 leading-snug">
          <svg className="inline-block align-[-3px] w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 18 18">
            <path d="M3.375 15.75C3.075 15.75 2.8125 15.6375 2.5875 15.4125C2.3625 15.1875 2.25 14.925 2.25 14.625V3.375C2.25 3.075 2.3625 2.8125 2.5875 2.5875C2.8125 2.3625 3.075 2.25 3.375 2.25H12.0375L15.75 5.9625V14.625C15.75 14.925 15.6375 15.1875 15.4125 15.4125C15.1875 15.6375 14.925 15.75 14.625 15.75H3.375ZM3.375 14.625H14.625V6.58931H11.4188V3.375H3.375V14.625ZM5.23125 12.5438H12.7687V11.4188H5.23125V12.5438ZM5.23125 6.58125H9V5.45625H5.23125V6.58125ZM5.23125 9.5625H12.7687V8.4375H5.23125V9.5625Z" />
          </svg>
          {post.title}
        </h3>
        <p className="text-sm text-gray-500 mt-2 line-clamp-4 leading-relaxed">
          <time>{date}</time>
          {post.excerpt ? ` - ${post.excerpt}` : ''}
        </p>
        <div className="mt-auto pt-4">
          <span className="inline-flex items-center gap-1 text-sm  text-orange-600 group-hover:text-orange-700 transition-colors">Ver más<svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></span>
        </div>
      </article>
    </Link>
  )
}

export default async function AyudasPage({ searchParams }: Props) {
  const { tematica, sector, page, q, date } = searchParams
  let allPosts = await getPostsBySeccion('ayudas', { tematica, sector })
  if (q) {
    const needle = q.toLowerCase()
    allPosts = allPosts.filter(
      (p) => p.title.toLowerCase().includes(needle) || (p.excerpt || '').toLowerCase().includes(needle)
    )
  }
  const cutoff = dateCutoff(date)
  if (cutoff) allPosts = allPosts.filter((p) => new Date(p.publishedAt) >= cutoff)
  const currentPage = Math.max(1, parseInt(page || '1', 10))
  const totalPages = Math.max(1, Math.ceil(allPosts.length / ITEMS_PER_PAGE))
  const posts = allPosts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  return (
    <>
      <section className="bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <SectionSearch basePath="/ayudas" q={q} date={date} hiddenParams={{ tematica, sector }} />
        </div>
      </section>
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl  text-gray-900 leading-tight">Ayudas y subvenciones para<br />innovación en los sectores del<br />plástico y el calzado</h1>
          <p className="mt-5 text-gray-500 max-w-2xl mx-auto leading-relaxed">En esta sección del Observatorio Tecnológico de CETEC se recopilan ayudas, subvenciones y convocatorias de financiación dirigidas a impulsar la innovación, la investigación y el desarrollo tecnológico en los sectores del plástico y el calzado.</p>
        </div>
      </section>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-10">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 rounded-md border border-[#DFDFDF] p-6" style={{ backgroundColor: '#F9F9F8' }}>
              <div>
                <h3 className="text-xs uppercase tracking-widest mb-5" style={{ color: '#333', fontWeight: 600 }}>Temática</h3>
                <ul>
                  {TEMATICAS.map((t) => {
                    const active = tematica === t.value
                    return (
                      <li key={t.value}>
                        <Link
                          href={{ pathname: '/ayudas', query: { ...(sector ? { sector } : {}), ...(active ? {} : { tematica: t.value }) } }}
                          className={`block text-sm py-2.5 pl-4 border-l-[3px] origin-left transition-all duration-200 ease-out hover:scale-105 hover:text-[#E8622A] hover:border-[#E8622A] ${active ? 'border-[#E8622A] text-[#E8622A] font-semibold' : 'border-[#E0E0E0] text-[#9E9E9E] font-normal'}`}
                        >
                          {t.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div className="mt-12">
                <h3 className="text-xs uppercase tracking-widest mb-5" style={{ color: '#333', fontWeight: 600 }}>Sector</h3>
                <ul>
                  {SECTORES.map((s) => {
                    const active = sector === s.value
                    return (
                      <li key={s.value}>
                        <Link
                          href={{ pathname: '/ayudas', query: { ...(tematica ? { tematica } : {}), ...(active ? {} : { sector: s.value }) } }}
                          className={`block text-sm py-2.5 pl-4 border-l-[3px] origin-left transition-all duration-200 ease-out hover:scale-105 hover:text-[#E8622A] hover:border-[#E8622A] ${active ? 'border-[#E8622A] text-[#E8622A] font-semibold' : 'border-[#E0E0E0] text-[#9E9E9E] font-normal'}`}
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
          <div className="flex-1 min-w-0">
            {posts.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">{posts.map((post) => <PostCard key={post._id} post={post} />)}</div>
                <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/ayudas" queryParams={{ ...(tematica ? { tematica } : {}), ...(sector ? { sector } : {}) }} />
              </>
            ) : (<p className="text-center text-gray-500 py-20">No hay ayudas publicadas con estos filtros.</p>)}
          </div>
        </div>
      </div>
    </>
  )
}
