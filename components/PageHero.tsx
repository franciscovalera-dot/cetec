/**
 * Hero/cabecera de página con título y descripción
 * Usado en las páginas de sección (Noticias, Agenda, etc.)
 */
interface PageHeroProps {
  title: string
  description?: string
  // Degradado de fondo personalizable
  gradient?: string
}

export default function PageHero({
  title,
  description,
  gradient = 'from-gray-900 to-gray-800',
}: PageHeroProps) {
  return (
    <section
      className={`bg-gradient-to-r ${gradient} text-white py-16 px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl ">{title}</h1>
        {description && (
          <p className="mt-4 text-lg text-gray-300 max-w-2xl">{description}</p>
        )}
      </div>
    </section>
  )
}
