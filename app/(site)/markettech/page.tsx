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
      {/* ─── HERO ────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-widest mb-4">MarketTech</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl  text-gray-900 leading-tight">
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
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 text-sm  text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
              >
                Explorar soluciones tecnológicas
              </Link>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl pointer-events-none" style={{ background: 'conic-gradient(from 180deg, #FF5B00 0%, #5E0360 50%, #FF5B00 100%)', filter: 'blur(30px)', opacity: 0.7 }} />
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8 text-center">
                  <h2 className="text-xl md:text-2xl  text-gray-900 leading-snug mb-8">
                    Explora tecnologías y materiales
                    innovadores que pueden transformar
                    los procesos y productos de la
                    industria.
                  </h2>
                  <div className="space-y-4 text-left">
                    <div className="flex gap-4 bg-gray-50 rounded-xl p-5">
                      <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm  text-gray-900 mb-1">Base de datos de soluciones tecnológicas</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          MarketTech reúne fichas de soluciones
                          tecnológicas aplicables que muestran ejemplos de
                          innovación desarrollados en distintos ámbitos
                          industriales.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 bg-gray-50 rounded-xl p-5">
                      <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm  text-gray-900 mb-1">Base de datos de materiales</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Además de soluciones tecnológicas, MarketTech
                          incluye información sobre materiales innovadores
                          que están adquiriendo relevancia en el desarrollo de
                          productos industriales.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clasificaciones.map((cat) => (
              <div key={cat.title} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
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
            className="inline-flex items-center gap-2 mt-10 px-7 py-3 text-sm  text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
          >
            Explorar soluciones tecnológicas
          </Link>
        </div>
      </section>
    </>
  )
}
