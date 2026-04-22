/**
 * PÁGINA INDIVIDUAL DE SOLUCIÓN MARKETTECH
 * Ruta: /markettech/[slug]
 */
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { client, urlFor } from '@/lib/sanity'

export const revalidate = 60
export const dynamicParams = true

// Componentes de Portable Text con estilo "descripción breve" (gris claro)
const descriptionComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-gray-500 leading-relaxed mb-4 last:mb-0">{children}</p>,
    h2: ({ children }) => <h2 className="text-xl  text-gray-900 mt-6 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg  text-gray-900 mt-4 mb-2">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-orange-500 pl-4 italic text-gray-500 my-4">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside text-gray-500 mb-4 space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside text-gray-500 mb-4 space-y-1">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className=" text-gray-700">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-orange-600 underline hover:text-orange-800 transition-colors">
        {children}
      </a>
    ),
  },
}

interface Solucion {
  _id: string
  title: string
  slug: { current: string }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description?: string | any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any
  publishedAt?: string
  numero?: string
  solicitante?: string
  inventor?: string
  fuente?: string
  tecnologia?: string
  sector?: string
  reto?: string
  material?: string
}

interface PageProps {
  params: { slug: string }
}

async function getSolucion(slug: string): Promise<Solucion | null> {
  return client.fetch(
    `*[_type == "solucion" && slug.current == $slug][0] {
      _id, title, slug, description, image, publishedAt,
      numero, solicitante, inventor, fuente,
      tecnologia, sector, reto, material
    }`,
    { slug },
    { next: { revalidate: 60 } }
  )
}

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch(
      `*[_type == "solucion" && defined(slug.current)]{ "slug": slug.current }`,
      {},
      { next: { revalidate: 60 } }
    )
    return slugs.map((s: { slug: string }) => ({ slug: s.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const sol = await getSolucion(params.slug)
  if (!sol) return { title: 'Solución no encontrada' }
  return {
    title: `${sol.title} | MarketTech`,
    description: sol.title,
  }
}

const metaItems = [
  { key: 'publishedAt', label: 'Fecha publicación', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', isDate: true },
  { key: 'numero', label: 'Número', icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14' },
  { key: 'solicitante', label: 'Solicitante', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { key: 'inventor', label: 'Inventor', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { key: 'fuente', label: 'Fuente', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
]

export default async function SolucionPage({ params }: PageProps) {
  const sol = await getSolucion(params.slug)
  if (!sol) notFound()

  return (
    <article className="bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-10">
          <Link href="/" className="hover:text-gray-600 transition-colors whitespace-nowrap">Inicio</Link>
          <span>›</span>
          <Link href="/markettech" className="hover:text-gray-600 transition-colors whitespace-nowrap">MarketTech</Link>
          <span>›</span>
          <span className="text-gray-600 truncate max-w-[250px]">{sol.title}</span>
        </nav>

        {/* Hero: título + imagen */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-12">

          {/* Columna izquierda: título + descripción */}
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem]  text-gray-900 leading-[1.15]">
              {sol.title}
            </h1>

            {sol.description && (
              <div className="mt-8">
                {typeof sol.description === 'string' ? (
                  <p className="text-gray-500 leading-relaxed">{sol.description}</p>
                ) : Array.isArray(sol.description) && sol.description.length > 0 ? (
                  <PortableText value={sol.description} components={descriptionComponents} />
                ) : null}
              </div>
            )}
          </div>

          {/* Columna derecha: imagen con glow naranja */}
          {sol.image && (
            <div className="relative">
              <div className="absolute -inset-3 rounded-2xl pointer-events-none" style={{ background: 'linear-gradient(135deg, #FF5B00 0%, #FF8A3B 100%)', filter: 'blur(20px)', opacity: 0.6 }} />
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={urlFor(sol.image).width(800).height(600).url()}
                  alt={sol.image.alt || sol.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}
        </div>

        {/* Metadatos */}
        <div className="mb-12 space-y-3">
          {metaItems.map((meta) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const value = (sol as any)[meta.key]
            if (!value) return null

            const display = meta.isDate
              ? new Date(value).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
              : value

            return (
              <div key={meta.key} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={meta.icon} />
                  </svg>
                </div>
                <p className="text-sm text-gray-700">
                  <span className="">{meta.label}:</span>{' '}
                  <span className="text-gray-500">{display}</span>
                </p>
              </div>
            )
          })}
        </div>

        {/* Volver */}
        <Link
          href="/markettech/soluciones"
          className="inline-flex items-center gap-2 text-sm  text-gray-500 hover:text-gray-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a MarketTech
        </Link>
      </div>
    </article>
  )
}
