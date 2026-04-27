/**
 * PÁGINA INDIVIDUAL DE EVENTO DE AGENDA
 * Ruta: /agenda/[slug]
 * Mismo layout que la página de artículo: contenedor único con título, imagen,
 * fecha, ubicación, descripción y enlace externo.
 */
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getEventBySlug, getAllEventSlugs, urlFor } from '@/lib/sanity'
import PortableTextRenderer from '@/components/PortableTextRenderer'
import BackButton from '@/components/BackButton'

export const revalidate = 60
export const dynamicParams = true

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllEventSlugs()
    return slugs.filter((s) => s.slug).map((s) => ({ slug: String(s.slug) }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const event = await getEventBySlug(params.slug)
  if (!event) return { title: 'Evento no encontrado' }
  return {
    title: event.title,
    description: event.location || `Evento: ${event.title}`,
    openGraph: {
      title: event.title,
      description: event.location || '',
      images: event.image ? [{ url: urlFor(event.image).width(1200).height(630).url() }] : [],
    },
  }
}

export default async function EventPage({ params }: PageProps) {
  const event = await getEventBySlug(params.slug)
  if (!event) notFound()

  const startDate = new Date(event.date)
  const endDate = event.endDate ? new Date(event.endDate) : null
  const isPast = startDate < new Date()

  const formatLong = (d: Date) =>
    d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })

  const dateLabel = endDate
    ? `${formatLong(startDate)} – ${formatLong(endDate)}`
    : formatLong(startDate)

  return (
    <article className="bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-10">
          <Link href="/" className="hover:text-gray-600 transition-colors whitespace-nowrap">
            Inicio
          </Link>
          <span>›</span>
          <Link href="/agenda" className="hover:text-gray-600 transition-colors whitespace-nowrap">
            Agenda
          </Link>
          <span>›</span>
          <span className="text-gray-600 truncate">{event.title}</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-md px-8 sm:px-12 py-10 sm:py-12 mb-8 border border-[#DFDFDF]"
            style={{ backgroundColor: '#F9F9F8' }}
          >
            {/* Badge: Próximo / Finalizado */}
            <div className="mb-4">
              <span
                className="text-[11px] text-white px-3 py-1 rounded-full"
                style={{
                  background: isPast
                    ? '#9CA3AF'
                    : 'linear-gradient(90deg, #5E0360 0%, #C98BCB 100%)',
                }}
              >
                {isPast ? 'Finalizado' : 'Próximo'}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] text-gray-900 leading-[1.2]">
              {event.title}
            </h1>

            {/* Fecha y ubicación */}
            <div className="mt-6 space-y-2">
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {dateLabel}
              </p>
              {event.location && (
                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </p>
              )}
            </div>

            {/* Imagen */}
            {event.image && (
              <div className="relative aspect-[16/9] rounded-md overflow-hidden my-10">
                <Image
                  src={urlFor(event.image).width(1600).height(900).url()}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Descripción */}
            {event.description && (
              <div className="mt-10 pt-10 border-t border-[#DFDFDF]">
                <PortableTextRenderer value={event.description} />
              </div>
            )}

            {/* Enlace externo */}
            {event.link && (
              <div className="mt-8">
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-700 transition-colors"
                >
                  Más información
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            )}
          </div>

          <BackButton fallbackHref="/agenda" label="Agenda" />
        </div>
      </div>
    </article>
  )
}
