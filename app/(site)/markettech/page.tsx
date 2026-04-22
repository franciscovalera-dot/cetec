/**
 * PÁGINA DE MARKETTECH — Landing
 * Hero + clasificación + cómo utilizar. El buscador/listado vive en /markettech/soluciones.
 */
import Link from 'next/link'

const clasificaciones = [
  {
    title: 'Tecnología habilitadora (KET)',
    items: ['Tecnologías verdes', 'Tecnologías digitales', 'Nuevos energía', 'Nanotecnología', 'Fabricación avanzada', 'Materiales avanzados'],
  },
  {
    title: 'Sector de aplicación',
    items: ['Plástico', 'Calzado'],
  },
  {
    title: 'Reto que soluciona',
    items: ['Reducción de residuos', 'Ahorro energético', 'Calidad de materiales reciclados', 'Mejora de la reciclabilidad'],
  },
  {
    title: 'Tipo de material',
    items: ['Bioplásticos', 'Polímeros'],
  },
]

export default function MarketTechPage() {
  return (
    <>
      {/* ─── SUB-NAV MARKETTECH ────────────────────────────── */}
      <section className="bg-white pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-8 px-4 sm:px-6 py-4 border border-gray-200 rounded-lg"
            style={{ backgroundColor: '#F9F9F8' }}
          >
            <span className="hidden sm:inline-block w-px h-4 bg-gray-300" />
            <a href="#soluciones" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Soluciones tecnológicas
            </a>
            <span className="w-px h-4 bg-gray-300" />
            <a href="#materiales" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Materiales
            </a>
            <span className="w-px h-4 bg-gray-300" />
            <a href="#tecnologias" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Tecnologías habilitadoras
            </a>
            <span className="hidden sm:inline-block w-px h-4 bg-gray-300" />
          </div>
        </div>
      </section>

      {/* ─── HERO ────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block px-5 py-2 mb-6 text-sm text-gray-500 border border-gray-200 rounded-full" style={{ backgroundColor: '#F9F9F8' }}>
                MarketTech
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl  text-gray-900 leading-snug">
                Soluciones<br />
                tecnológicas<br />
                para la industria
              </h1>
              <p className="mt-6 text-gray-500 leading-relaxed max-w-md">
                Esta sección del Observatorio Tecnológico de CETEC se
                encuentra en proceso de construcción con el fin de
                impulsar la innovación, la investigación
                y el desarrollo tecnológico en los sectores del plástico y el
                calzado.
              </p>
              <Link
                href="/markettech/soluciones"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 text-sm  text-white bg-black rounded-full hover:bg-gray-800 transition-colors"
              >
                Explorar soluciones tecnológicas
              </Link>
            </div>

            <div className="relative overflow-visible">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/markettech-card.png"
                alt="Explora tecnologías y materiales innovadores. Base de datos de soluciones tecnológicas y de materiales."
                className="w-full lg:w-[135%] max-w-none h-auto lg:ml-auto block"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── CLASIFICACIÓN DE LAS SOLUCIONES ─────────────────── */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl  text-gray-900 leading-tight">
                Clasificación de<br />
                las soluciones
              </h2>
            </div>
            <div className="flex items-center">
              <p className="text-gray-500 leading-relaxed">
                Las soluciones tecnológicas incluidas en MarketTech se
                organizan mediante distintos criterios de clasificación para
                facilitar su búsqueda y análisis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tarjetas de clasificación — full width con patrón de círculos */}
      <section
        className="relative overflow-hidden py-16 md:py-24"
        style={{ background: 'linear-gradient(180deg, #FFD6B8 0%, #5E0360 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='38' fill='none' stroke='%23ffffff' stroke-width='0.6' stroke-opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-white/60 rounded-2xl p-2 md:p-3">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {clasificaciones.map((cat) => (
                <div key={cat.title} className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                  <h3 className="text-sm  text-gray-900 mb-5 leading-snug min-h-[40px]">{cat.title}</h3>
                  <ul className="space-y-2">
                    {cat.items.map((item) => (
                      <li key={item} className="text-sm text-gray-500 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CÓMO UTILIZAR MARKETTECH ────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-3xl md:text-4xl  text-gray-900 leading-tight">
            Cómo utilizar<br />
            MarketTech
          </h2>
          <p className="mt-8 text-gray-500 leading-relaxed max-w-xl mx-auto">
            El buscador de MarketTech permite filtrar las soluciones tecnológicas según diferentes
            criterios: desde la tecnología empleada al sector de aplicación, el reto que aborda o el
            tipo de material utilizado.
          </p>
          <p className="mt-6 text-gray-500 leading-relaxed max-w-xl mx-auto">
            Este sistema de filtrado facilita localizar rápidamente soluciones tecnológicas que
            pueden resultar relevantes para empresas, investigadores o profesionales interesados
            en identificar nuevas oportunidades de innovación.
          </p>
          <Link
            href="/markettech/soluciones"
            className="inline-flex items-center gap-2 mt-10 px-7 py-3 text-sm  text-white bg-black rounded-full hover:bg-gray-800 transition-colors"
          >
            Explorar soluciones tecnológicas
          </Link>
        </div>
      </section>
    </>
  )
}
