/**
 * Tarjeta de artículo reutilizable
 * Estilo simple sin imagen: pill de sección + título + fecha/extracto + "Ver más"
 */
import Image from 'next/image'
import Link from 'next/link'
import { urlFor, type Post } from '@/lib/sanity'
import CategoryBadge from './CategoryBadge'

interface PostCardProps {
  post: Post
  // Variante visual: por defecto vertical, horizontal para listados secundarios
  variant?: 'vertical' | 'horizontal'
}

export default function PostCard({ post, variant = 'vertical' }: PostCardProps) {
  const href = `/${post.category?.slug?.current || 'noticias'}/${post.slug.current}`

  // Formato corto numérico: 05/03/2026
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  if (variant === 'horizontal') {
    return (
      <Link href={href} className="group">
        <article className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
          {post.image && (
            <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={urlFor(post.image).width(256).height(192).url()}
                alt={post.image.alt || post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            {post.category && (
              <CategoryBadge
                name={post.category.name}
                color={post.category.color}
                small
              />
            )}
            <h3 className=" text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mt-1">
              {post.title}
            </h3>
            <time className="text-xs text-gray-500 mt-1 block">
              {formattedDate}
            </time>
          </div>
        </article>
      </Link>
    )
  }

  // Variante vertical (tarjeta sin imagen, estilo listado)
  const sectorLabel = post.sector
    ? ({ plastico: 'Plástico', calzado: 'Calzado', agroalimentario: 'Agroalimentario' } as Record<string, string>)[post.sector]
    : null

  return (
    <Link href={href} className="group">
      <article className="bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all h-full flex flex-col p-5">
        {/* Pills: sector (naranja) + categoría (morado) */}
        <div className="flex items-center gap-2 mb-4">
          {sectorLabel && (
            <span
              className="text-[11px]  text-white px-3 py-1 rounded-full"
              style={{ background: 'linear-gradient(90deg, #FF813B 0%, #FFD4B8 100%)' }}
            >
              {sectorLabel}
            </span>
          )}
          {post.category && (
            <span
              className="text-[11px]  text-white px-3 py-1 rounded-full"
              style={{ background: 'linear-gradient(90deg, #5E0360 0%, #C98BCB 100%)' }}
            >
              {post.category.name}
            </span>
          )}
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

        {/* Ver más */}
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
