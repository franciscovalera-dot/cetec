/**
 * PAGINA DE AGENDA — Eventos del sector
 */
import { getAllEvents } from '@/lib/sanity'
import type { AgendaEvent } from '@/lib/sanity'
import SectionSearch from '@/components/SectionSearch'

export const revalidate = 60
export const metadata = { title: 'Agenda' }

interface Props { searchParams: { q?: string; date?: string } }

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

function EventCard({ event }: { event: AgendaEvent }) {
  const date = new Date(event.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
  const isPast = new Date(event.date) < new Date()
  return (
    <article className="bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all h-full flex flex-col p-5">
      <div className="flex items-center gap-2 mb-4">
        <span
          className="text-[11px]  text-white px-3 py-1 rounded-full"
          style={{ background: isPast ? '#9CA3AF' : 'linear-gradient(90deg, #5E0360 0%, #C98BCB 100%)' }}
        >
          {isPast ? 'Finalizado' : 'Próximo'}
        </span>
      </div>
      <h3 className=" text-gray-900 line-clamp-2 leading-snug">{event.title}</h3>
      <div className="mt-3 space-y-1">
        <p className="text-sm text-gray-500 flex items-center gap-1.5">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          {date}
        </p>
        {event.location && (
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {event.location}
          </p>
        )}
      </div>
      {event.link && (
        <div className="mt-auto pt-4">
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm  text-orange-600 hover:text-orange-700 transition-colors"
          >
            Más información
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>
      )}
    </article>
  )
}

export default async function AgendaPage({ searchParams }: Props) {
  const { q, date } = searchParams
  let events = await getAllEvents()
  if (q) {
    const needle = q.toLowerCase()
    events = events.filter(
      (e) => e.title.toLowerCase().includes(needle) || (e.location || '').toLowerCase().includes(needle)
    )
  }
  const cutoff = dateCutoff(date)
  if (cutoff) events = events.filter((e) => new Date(e.date) >= cutoff)
  return (
    <>
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <SectionSearch basePath="/agenda" q={q} date={date} />
        </div>
      </section>
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl  text-gray-900 leading-tight">Agenda de eventos del sector<br />del plástico y el calzado</h1>
          <p className="mt-5 text-gray-500 max-w-2xl mx-auto leading-relaxed">En esta sección del Observatorio Tecnológico de CETEC se recogen los principales eventos relacionados con la innovación, la investigación y el desarrollo tecnológico en los sectores del plástico y el calzado.</p>
        </div>
      </section>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex-1 min-w-0">
          {events.length > 0 ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.map((event) => <EventCard key={event._id} event={event} />)}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-20">No hay eventos programados.</p>
          )}
        </div>
      </div>
    </>
  )
}
