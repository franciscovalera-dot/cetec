/**
 * PÁGINA DE ARTÍCULO INDIVIDUAL
 * Ruta dinámica: /[category]/[slug]
 * Layout: sidebar izquierda (tecnologías + descriptores) + contenido principal
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
import PostCard from '@/components/PostCard'
import PortableTextRenderer from '@/components/PortableTextRenderer'

export const revalidate = 60
export const dynamicParams = true

interface PageProps {
  params: { category: string; slug: string }
}

// Etiquetas legibles por sección para el botón "Volver a…"
const SECTION_LABELS: Record<string, string> = {
  noticias:   'Noticias',
  normativa:  'Normativa',
  formacion:  'Formación',
  ayudas:     'Ayudas',
  agenda:     'Agenda',
  documentos: 'Documentos',
  markettech: 'MarketTech',
}

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
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  const relatedPosts = await getRelatedPosts(
    post.category?.slug?.current || '',
    params.slug,
    3
  )

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const hasTecnologias = post.tecnologias && post.tecnologias.length > 0
  const hasDescriptores = post.descriptores && post.descriptores.length > 0

  return (
    <article className="bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">

        {/* ─── BREADCRUMB ─────────── */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-10">
          <Link href="/" className="hover:text-gray-600 transition-colors whitespace-nowrap">
            Inicio
          </Link>
          <span>›</span>
          {post.category && (
            <>
              <Link
                href={`/${post.seccion || params.category}`}
                className="hover:text-gray-600 transition-colors whitespace-nowrap"
              >
                {post.category.name}
              </Link>
              <span>›</span>
            </>
          )}
          <span className="text-gray-600 truncate">{post.title}</span>
        </nav>

        {/* ─── LAYOUT: SIDEBAR + CONTENIDO ─────────────────────── */}
        <div className="flex gap-8">

          {/* ─── SIDEBAR IZQUIERDA (tecnologías + descriptores) ─── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 rounded-md border border-[#DFDFDF] p-6 space-y-8" style={{ backgroundColor: '#F9F9F8' }}>
              <div>
                <h4 className="text-xs  text-gray-900 uppercase tracking-widest mb-4">
                  Tecnologías asociadas
                </h4>
                {hasTecnologias ? (
                  <div className="flex flex-wrap gap-2">
                    {post.tecnologias!.map((t) => (
                      <span key={t} className="text-sm px-4 py-2 bg-white text-gray-600 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">—</p>
                )}
              </div>

              <div>
                <h4 className="text-xs  text-gray-900 uppercase tracking-widest mb-4">
                  Descriptores
                </h4>
                {hasDescriptores ? (
                  <div className="flex flex-wrap gap-2">
                    {post.descriptores!.map((d) => (
                      <span key={d} className="text-sm px-4 py-2 bg-white text-gray-600 rounded-full">
                        {d}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">—</p>
                )}
              </div>
            </div>
          </aside>

          {/* ─── CONTENIDO PRINCIPAL ────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Contenedor único: título + imagen + cuerpo */}
            <div className="rounded-md px-8 sm:px-12 py-10 sm:py-12 mb-8 border border-[#DFDFDF]" style={{ backgroundColor: '#F9F9F8' }}>
              {post.category && (
                <p className="text-sm  text-orange-600 uppercase tracking-wide mb-4">
                  {post.category.name}
                </p>
              )}

              <h1 className="text-3xl md:text-4xl lg:text-[2.75rem]  text-gray-900 leading-[1.2]">
                {post.title}
              </h1>

              <div className="flex items-center gap-3 mt-6 text-sm text-gray-400">
                <time>{formattedDate}</time>
                {post.author && (
                  <>
                    <span>·</span>
                    <span>{post.author.name}</span>
                  </>
                )}
              </div>

              {/* Imagen principal — ancho completo del contenedor */}
              {post.image && (
                <div className="relative aspect-[16/9] rounded-md overflow-hidden my-10">
                  <Image
                    src={urlFor(post.image).width(1600).height(900).url()}
                    alt={post.image.alt || post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {post.excerpt && (
                <p className="text-lg text-gray-600 leading-relaxed mb-10 pb-10 border-b border-[#DFDFDF]">
                  {post.excerpt}
                </p>
              )}

              {post.body && <PortableTextRenderer value={post.body} />}
            </div>

            {/* Tecnologías y descriptores (móvil — debajo del contenido) */}
            {(hasTecnologias || hasDescriptores) && (
              <div className="lg:hidden rounded-2xl px-6 py-8 mb-8" style={{ backgroundColor: '#F9F9F8' }}>
                {hasTecnologias && (
                  <div className="mb-8 last:mb-0">
                    <h4 className="text-xs  text-gray-900 uppercase tracking-widest mb-4">
                      Tecnologías asociadas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {post.tecnologias!.map((t) => (
                        <span key={t} className="text-sm px-4 py-2 bg-white text-gray-600 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {hasDescriptores && (
                  <div>
                    <h4 className="text-xs  text-gray-900 uppercase tracking-widest mb-4">
                      Descriptores
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {post.descriptores!.map((d) => (
                        <span key={d} className="text-sm px-4 py-2 bg-white text-gray-600 rounded-full">{d}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Etiquetas */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/busqueda?q=${encodeURIComponent(tag)}`}
                    className="text-sm px-3 py-1.5 text-gray-600 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    style={{ backgroundColor: '#F9F9F8' }}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── BOTÓN VOLVER (reactivo según sección) ────────────── */}
        {(() => {
          const backSlug = post.seccion || params.category
          const backLabel = post.category?.name || SECTION_LABELS[backSlug] || 'inicio'
          return (
            <div className="mt-10">
              <Link
                href={`/${backSlug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-gray-700 border border-[#DFDFDF] rounded hover:bg-gray-100 transition-colors"
                style={{ backgroundColor: '#F9F9F8' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver a {backLabel}
              </Link>
            </div>
          )
        })()}
      </div>

      {/* ─── SOBRE EL AUTOR ────────────────────────────────────── */}
      {post.author && post.author.bio && (
        <div className="bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-start gap-4">
              {post.author.image && (
                <Image
                  src={urlFor(post.author.image).width(120).height(120).url()}
                  alt={post.author.name}
                  width={52}
                  height={52}
                  className="rounded-full object-cover flex-shrink-0"
                />
              )}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide ">
                  Sobre el autor
                </p>
                <p className=" text-gray-900 mt-1">{post.author.name}</p>
                <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                  {post.author.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── ARTÍCULOS RELACIONADOS ────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="bg-white border-t border-[#DFDFDF]">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-2xl  text-gray-900 mb-8">
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
