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
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-8 px-4 sm:px-6 py-4 border border-[#DFDFDF] rounded-lg"
            style={{ backgroundColor: '#F9F9F8' }}
          >
            <span className="hidden sm:inline-block w-px h-4 bg-gray-300" />
            <Link href="/markettech/soluciones" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Soluciones tecnológicas
            </Link>
            <span className="w-px h-4 bg-gray-300" />
            <Link href="/markettech/soluciones" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Materiales
            </Link>
            <span className="w-px h-4 bg-gray-300" />
            <Link href="/markettech/soluciones" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Tecnologías habilitadoras
            </Link>
            <span className="hidden sm:inline-block w-px h-4 bg-gray-300" />
          </div>
        </div>
      </section>

      {/* ─── HERO ────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-block px-5 py-2 mb-6 text-sm text-gray-500 border border-[#DFDFDF] rounded-full" style={{ backgroundColor: '#F9F9F8' }}>
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
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 text-sm  text-white bg-black rounded hover:bg-gray-800 transition-colors"
              >
                Explorar soluciones tecnológicas
              </Link>
            </div>

            <div className="relative overflow-visible w-full lg:w-[135%] max-w-none lg:ml-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Group%20112.png"
                alt=""
                aria-hidden="true"
                className="w-full h-auto block"
              />

              {/* Texto overlay dentro del marco blanco */}
              <div className="absolute inset-0 flex items-start justify-center pt-[20%]" style={{ fontFamily: "'Stack Sans Text', sans-serif" }}>
                <div className="w-[60%] lg:w-[62%]">
                  <h3 className="text-gray-900 text-[22px] lg:text-[26px] xl:text-[30px] leading-[1.19]" style={{ fontFamily: "'Stack Sans Text', sans-serif", fontWeight: 400 }}>
                    Explora tecnologías y materiales innovadores que pueden transformar los procesos y productos de la industria.
                  </h3>

                  <div className="mt-10 space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-[5px] border border-[#DFDFDF] bg-[#F9F9F8] flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                          <rect x="6" y="6" width="12" height="12" rx="1.5" />
                          <rect x="9.5" y="9.5" width="5" height="5" rx="0.6" />
                          <path d="M10 6V4M14 6V4M10 20v-2M14 20v-2M6 10H4M6 14H4M20 10h-2M20 14h-2" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-[17px] text-gray-900" style={{ fontFamily: "'Stack Sans Text', sans-serif", fontWeight: 600 }}>Base de datos de soluciones tecnológicas</h4>
                        <p className="mt-1.5 text-[14px] text-gray-500 leading-relaxed" style={{ fontFamily: "'Stack Sans Text', sans-serif", fontWeight: 400 }}>
                          MarketTech reúne fichas de soluciones tecnológicas aplicadas que muestran ejemplos de innovación desarrollados en distintos ámbitos industriales.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-[5px] border border-[#DFDFDF] bg-[#F9F9F8] flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                          <ellipse cx="12" cy="6" rx="7" ry="2.5" />
                          <path d="M5 6v5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
                          <path d="M5 11v5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-5" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-[17px] text-gray-900" style={{ fontFamily: "'Stack Sans Text', sans-serif", fontWeight: 600 }}>Base de datos de materiales</h4>
                        <p className="mt-1.5 text-[14px] text-gray-500 leading-relaxed" style={{ fontFamily: "'Stack Sans Text', sans-serif", fontWeight: 400 }}>
                          Además de soluciones tecnológicas, MarketTech incluye información sobre materiales innovadores que están adquiriendo relevancia en el desarrollo de productos industriales.
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
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
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

      {/* Tarjetas de clasificación — bloque con fondo imagen (bordes redondeados + margen lateral) */}
      <section className="bg-white px-4 md:px-8 py-8">
        <div
          className="relative overflow-hidden rounded-2xl py-28 md:py-40 bg-cover bg-center"
          style={{ backgroundImage: `url('/markettech-bg-clasificacion.png')` }}
        >
          <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
            className="inline-flex items-center gap-2 mt-10 px-7 py-3 text-sm  text-white bg-black rounded hover:bg-gray-800 transition-colors"
          >
            Explorar soluciones tecnológicas
          </Link>
        </div>
      </section>
    </>
  )
}
