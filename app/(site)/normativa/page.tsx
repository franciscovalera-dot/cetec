/**
 * PÁGINA DE NORMATIVA — Legislación del sector
 */
import { getPostsBySeccion } from '@/lib/sanity'
import Link from 'next/link'
import type { Post } from '@/lib/sanity'
import Pagination from '@/components/Pagination'

const ITEMS_PER_PAGE = 12

export const revalidate = 60
export const metadata = { title: 'Normativa' }

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

interface Props { searchParams: { tematica?: string; sector?: string; page?: string } }

function PostCard({ post }: { post: Post }) {
  const href = `/${post.seccion || 'normativa'}/${post.slug.current}`
  const date = new Date(post.publishedAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const secLabel = SECCION_LABELS[post.seccion || 'normativa'] || 'Normativa'
  const sectorLabel = post.sector ? SECTOR_LABELS[post.sector] : null
  return (
    <Link href={href} className="group">
      <article className="bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all h-full flex flex-col p-5">
        <div className="flex items-center gap-2 mb-4">
          {sectorLabel && <span className="text-[11px] font-semibold text-white px-3 py-1 rounded-full" style={{ background: 'linear-gradient(90deg, #FF813B 0%, #FFD4B8 100%)' }}>{sectorLabel}</span>}
          <span className="text-[11px] font-semibold text-white px-3 py-1 rounded-full" style={{ background: 'linear-gradient(90deg, #5E0360 0%, #C98BCB 100%)' }}>{secLabel}</span>
        </div>
        <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-3 leading-snug">
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
          <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 group-hover:text-orange-700 transition-colors">Ver más<svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></span>
        </div>
      </article>
    </Link>
  )
}

export default async function NormativaPage({ searchParams }: Props) {
  const { tematica, sector, page } = searchParams
  const allPosts = await getPostsBySeccion('normativa', { tematica, sector })
  const currentPage = Math.max(1, parseInt(page || '1', 10))
  const totalPages = Math.max(1, Math.ceil(allPosts.length / ITEMS_PER_PAGE))
  const posts = allPosts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  return (
    <>
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
          <p className="text-sm text-gray-400 tracking-widest uppercase mb-4">Observatorio Tecnológico CETEC</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">Normativa y legislación del<br />sector del plástico y el calzado</h1>
          <p className="mt-5 text-gray-500 max-w-2xl mx-auto leading-relaxed">Cambios normativos relevantes, legislación europea y nacional, y fechas de entrada en vigor que afectan al sector.</p>
        </div>
      </section>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-10">
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-8 bg-gray-50 rounded-xl p-4">
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Temática</h3>
                <ul className="space-y-0.5">{TEMATICAS.map((t) => (<li key={t.value}><Link href={{ pathname: '/normativa', query: { ...(sector ? { sector } : {}), ...(tematica === t.value ? {} : { tematica: t.value }) } }} className={`block px-3 py-2 text-sm rounded-lg transition-colors ${tematica === t.value ? 'text-orange-600 font-semibold bg-orange-50' : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'}`}>{t.label}</Link></li>))}</ul>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Sector</h3>
                <ul className="space-y-0.5">{SECTORES.map((s) => (<li key={s.value}><Link href={{ pathname: '/normativa', query: { ...(tematica ? { tematica } : {}), ...(sector === s.value ? {} : { sector: s.value }) } }} className={`block px-3 py-2 text-sm rounded-lg transition-colors ${sector === s.value ? 'text-orange-600 font-semibold bg-orange-50' : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'}`}>{s.label}</Link></li>))}</ul>
              </div>
            </div>
          </aside>
          <div className="flex-1 min-w-0">
            {posts.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">{posts.map((post) => <PostCard key={post._id} post={post} />)}</div>
                <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/normativa" queryParams={{ ...(tematica ? { tematica } : {}), ...(sector ? { sector } : {}) }} />
              </>
            ) : (<p className="text-center text-gray-500 py-20">No hay artículos de normativa con estos filtros.</p>)}
          </div>
        </div>
      </div>
    </>
  )
}
