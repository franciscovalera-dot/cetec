/**
 * Tarjeta de artículo reutilizable
 * Muestra imagen, categoría, título, extracto y fecha
 */
import Image from 'next/image'
import Link from 'next/link'
import { urlFor, type Post } from '@/lib/sanity'
import CategoryBadge from './CategoryBadge'

interface PostCardProps {
  post: Post
  // Variante visual: por defecto vertical, horizontal para listados
  variant?: 'vertical' | 'horizontal'
}

export default function PostCard({ post, variant = 'vertical' }: PostCardProps) {
  const href = `/${post.category?.slug?.current || 'noticias'}/${post.slug.current}`

  // Formatear la fecha en español
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (variant === 'horizontal') {
    return (
      <Link href={href} className="group">
        <article className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
          {/* Imagen miniatura */}
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
            <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mt-1">
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

  // Variante vertical (tarjeta completa)
  return (
    <Link href={href} className="group">
      <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
        {/* Imagen principal */}
        {post.image && (
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={urlFor(post.image).width(640).height(400).url()}
              alt={post.image.alt || post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-5">
          {/* Badge de categoría */}
          {post.category && (
            <CategoryBadge
              name={post.category.name}
              color={post.category.color}
            />
          )}
          {/* Título */}
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors mt-2 line-clamp-2">
            {post.title}
          </h3>
          {/* Extracto */}
          {post.excerpt && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-3">
              {post.excerpt}
            </p>
          )}
          {/* Meta: fecha y autor */}
          <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
            <time>{formattedDate}</time>
            {post.author && (
              <>
                <span className="text-gray-300">|</span>
                <span>{post.author.name}</span>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
