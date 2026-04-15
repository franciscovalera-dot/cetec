/**
 * PÁGINA DE ARTÍCULO INDIVIDUAL
 * Ruta dinámica: /[category]/[slug]
 * Muestra el artículo completo con imagen, autor, contenido PT y posts relacionados
 */
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getPostBySlug,
  getRelatedPosts,
  getAllPostSlugs,
  urlFor,
} from '@/lib/sanity'
import CategoryBadge from '@/components/CategoryBadge'
import PostCard from '@/components/PostCard'
import PortableTextRenderer from '@/components/PortableTextRenderer'

// ISR: revalidar cada 60 segundos
export const revalidate = 60
// Permitir rutas dinámicas no pre-renderizadas
export const dynamicParams = true

// Tipado de los parámetros de la ruta dinámica
interface PageProps {
  params: { category: string; slug: string }
}

/**
 * Generar rutas estáticas en build time
 * para todos los posts existentes en Sanity
 */
export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs()
    return slugs
      .filter((item) => item.slug && item.category)
      .map((item) => ({
        category: String(item.category),
        slug: String(item.slug),
      }))
  } catch {
    // Si no hay conexión a Sanity (build sin credenciales), retornar vacío
    return []
  }
}

/**
 * Metadatos dinámicos para SEO
 * Título y descripción del artículo
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return { title: 'Artículo no encontrado' }

  return {
    title: post.title,
    description: post.excerpt || `Artículo: ${post.title}`,
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      images: post.image
        ? [{ url: urlFor(post.image).width(1200).height(630).url() }]
        : [],
    },
  }
}

export default async function ArticlePage({ params }: PageProps) {
  // Obtener el artículo por slug
  const post = await getPostBySlug(params.slug)

  // Si no existe, mostrar 404
  if (!post) notFound()

  // Obtener artículos relacionados (misma categoría)
  const relatedPosts = await getRelatedPosts(
    post.category?.slug?.current || '',
    params.slug,
    3
  )

  // Formatear fecha en español
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article>
      {/* ─── CABECERA DEL ARTÍCULO ──────────────────────────── */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb / navegación de contexto */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link
              href="/"
              className="hover:text-orange-600 transition-colors"
            >
              Inicio
            </Link>
            <span>/</span>
            {post.category && (
              <>
                <Link
                  href={`/noticias?cat=${post.category.slug.current}`}
                  className="hover:text-orange-600 transition-colors"
                >
                  {post.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-400 truncate">{post.title}</span>
          </nav>

          {/* Badge de categoría */}
          {post.category && (
            <CategoryBadge
              name={post.category.name}
              color={post.category.color}
            />
          )}

          {/* Título del artículo */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-4 leading-tight">
            {post.title}
          </h1>

          {/* Extracto / resumen */}
          {post.excerpt && (
            <p className="mt-4 text-xl text-gray-600 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta: autor y fecha */}
          <div className="flex items-center gap-4 mt-8">
            {/* Avatar del autor */}
            {post.author && (
              <div className="flex items-center gap-3">
                {post.author.image && (
                  <Image
                    src={urlFor(post.author.image).width(80).height(80).url()}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {post.author.name}
                  </p>
                  <time className="text-sm text-gray-500">{formattedDate}</time>
                </div>
              </div>
            )}

            {/* Etiquetas / tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 ml-auto">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/busqueda?q=${encodeURIComponent(tag)}`}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── IMAGEN PRINCIPAL ───────────────────────────────── */}
      {post.image && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mb-8">
          <div className="relative aspect-[2/1] rounded-2xl overflow-hidden shadow-lg mt-8">
            <Image
              src={urlFor(post.image).width(1400).height(700).url()}
              alt={post.image.alt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* ─── CUERPO DEL ARTÍCULO (Portable Text) ────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {post.body && <PortableTextRenderer value={post.body} />}

        {/* Etiquetas al final del artículo (móvil) */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Etiquetas
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/busqueda?q=${encodeURIComponent(tag)}`}
                  className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── SOBRE EL AUTOR ─────────────────────────────────── */}
      {post.author && post.author.bio && (
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-start gap-4">
              {post.author.image && (
                <Image
                  src={urlFor(post.author.image).width(120).height(120).url()}
                  alt={post.author.name}
                  width={60}
                  height={60}
                  className="rounded-full object-cover flex-shrink-0"
                />
              )}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                  Sobre el autor
                </p>
                <p className="font-bold text-gray-900 mt-1">
                  {post.author.name}
                </p>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {post.author.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── ARTÍCULOS RELACIONADOS ─────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Artículos relacionados
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <PostCard key={related._id} post={related} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
