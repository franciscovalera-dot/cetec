/**
 * PÁGINA DE AYUDAS — Subvenciones para innovación
 */
import { getPostsBySeccion } from '@/lib/sanity'
import Link from 'next/link'
import type { Post } from '@/lib/sanity'

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

interface Props { searchParams: { tematica?: string; sector?: string } }

function PostCard({ post }: { post: Post }) {
  const href = `/${post.seccion || 'ayudas'}/${post.slug.current}`
  const date = new Date(post.publishedAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const secLabel = SECCION_LABELS[post.seccion || 'ayudas'] || 'Ayudas'
  const sectorLabel = post.sector ? SECTOR_LABELS[post.sector] : null
  return (
    <Link href={href} className="group">
      <article className="bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all h-full flex flex-col p-5">
        <div className="flex items-center gap-2 mb-4">
          {sectorLabel && <span className="text-[11px] font-semibold text-white px-3 py-1 rounded-full" style={{ background: 'linear-gradient(90deg, #FF813B 0%, #FFD4B8 100%)' }}>{sectorLabel}</span>}
          <span className="text-[11px] font-semibold text-white px-3 py-1 rounded-full" style={{ background: 'linear-gradient(90deg, #5E0360 0%, #C98BCB 100%)' }}>{secLabel}</span>
        </div>
        <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">{post.title}</h3>
        {post.excerpt && <p className="text-sm text-gray-500 mt-2 line-clamp-3 leading-relaxed">{post.excerpt}</p>}
        <time className="text-xs text-gray-400 mt-3 block">{date}</time>
        <div className="mt-auto pt-4">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 group-hover:text-orange-700 transition-colors">Ver más<svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></span>
        </div>
      </article>
    </Link>
  )
}

export default async function AyudasPage({ searchParams }: Props) {
  const { tematica, sector } = searchParams
  const posts = await getPostsBySeccion('ayudas', { tematica, sector })
  return (
    <>
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
          <p className="text-sm text-gray-400 tracking-widest uppercase mb-4">Observatorio Tecnológico CETEC</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">Ayudas y subvenciones para<br />innovación en los sectores del<br />plástico y el calzado</h1>
          <p className="mt-5 text-gray-500 max-w-2xl mx-auto leading-relaxed">Convocatorias abiertas, programas de financiación y oportunidades de subvención para empresas del sector.</p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-10">
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Temática</h3>
                <ul className="space-y-0.5">{TEMATICAS.map((t) => (<li key={t.value}><Link href={{ pathname: '/ayudas', query: { ...(sector ? { sector } : {}), ...(tematica === t.value ? {} : { tematica: t.value }) } }} className={`block px-3 py-2 text-sm rounded-lg transition-colors ${tematica === t.value ? 'text-orange-600 font-semibold bg-orange-50' : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'}`}>{t.label}</Link></li>))}</ul>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Sector</h3>
                <ul className="space-y-0.5">{SECTORES.map((s) => (<li key={s.value}><Link href={{ pathname: '/ayudas', query: { ...(tematica ? { tematica } : {}), ...(sector === s.value ? {} : { sector: s.value }) } }} className={`block px-3 py-2 text-sm rounded-lg transition-colors ${sector === s.value ? 'text-orange-600 font-semibold bg-orange-50' : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'}`}>{s.label}</Link></li>))}</ul>
              </div>
            </div>
          </aside>
          <div className="flex-1 min-w-0">
            {posts.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">{posts.map((post) => <PostCard key={post._id} post={post} />)}</div>
            ) : (<p className="text-center text-gray-500 py-20">No hay ayudas publicadas con estos filtros.</p>)}
          </div>
        </div>
      </div>
    </>
  )
}
