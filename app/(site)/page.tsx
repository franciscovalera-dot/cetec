/**
 * PÁGINA DE INICIO
 * Hero centrado + 4 tarjetas de secciones con gradientes + últimos informes de vigilancia
 */
import Link from 'next/link'
import { getLatestPosts } from '@/lib/sanity'
import CategorySlider from '@/components/CategorySlider'

// ISR: revalidar cada 60 segundos
export const revalidate = 60

// Datos de ejemplo para cuando Sanity no tiene contenido todavía
const demoReports = [
  {
    _id: 'demo-1',
    title: 'PureCycle and TOPPAN establish partnership to deliver sustainable packaging solutions with recycled content',
    excerpt:
      'A global garden and power-tool brand has brought the production of two critical thermoset engine components in-house at its US plant to stabilise dimensional accuracy and functional quality. Central…',
    publishedAt: '2026-04-06',
    seccion: 'noticias',
    sector: 'plastico',
    slug: { current: 'purecycle-toppan-partnership' },
    category: { name: 'Noticias', slug: { current: 'noticias' }, color: '#F97316' },
  },
  {
    _id: 'demo-2',
    title: 'PureCycle and TOPPAN establish partnership to deliver sustainable packaging solutions with recycled content',
    excerpt:
      'A global garden and power-tool brand has brought the production of two critical thermoset engine components in-house at its US plant to stabilise dimensional accuracy and functional quality. Central…',
    publishedAt: '2026-04-06',
    seccion: 'formacion',
    sector: 'plastico',
    slug: { current: 'purecycle-toppan-partnership-2' },
    category: { name: 'Formación', slug: { current: 'formacion' }, color: '#F97316' },
  },
]

const SECCION_LABELS: Record<string, string> = {
  noticias: 'Noticias',
  normativa: 'Normativa',
  formacion: 'Formación y cursos',
  ayudas: 'Ayudas',
  agenda: 'Agenda',
  markettech: 'MarketTech',
}

const SECTOR_LABELS: Record<string, string> = {
  plastico: 'Plástico',
  calzado: 'Calzado',
  agroalimentario: 'Agroalimentario',
}

// Las 4 tarjetas de sección — gradientes horizontales exactos de Figma
const sectionCards = [
  {
    href: '/noticias',
    title: 'Noticias',
    description: 'Novedades del sector, innovación y actualidad tecnológica.',
    button: 'Ver noticias',
    gradient: 'linear-gradient(to right, #FF5B00 0%, #FFA370 100%)',
  },
  {
    href: '/normativa',
    title: 'Normativa y\nLegislación',
    description: 'Cambios normativos relevantes y fechas de entrada en vigor.',
    button: 'Ver normativa',
    gradient: 'linear-gradient(to right, #5E0360 0%, #B12E5C 41%, #FF5B00 83%)',
  },
  {
    href: '/formacion',
    title: 'Formación\ny Cursos',
    description: 'Formación especializada para empresas y profesionales del sector.',
    button: 'Ver formación',
    gradient: 'linear-gradient(to right, #5E0360 0%, #F675F9 100%)',
  },
  {
    href: '/ayudas',
    title: 'Ayudas y\nSubvenciones',
    description: 'Convocatorias abiertas y oportunidades de financiación.',
    button: 'Ver todas las ayudas',
    gradient: 'linear-gradient(to right, #5E0360 0%, #8DBEFF 100%)',
  },
]

export default async function HomePage() {
  // Intentar obtener posts reales de Sanity
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let posts: any[] = []
  try {
    posts = await getLatestPosts(2)
  } catch {
    // Si Sanity no está configurado, usar datos demo
  }

  // Usar posts reales si existen, sino los de ejemplo
  const reports = posts.length > 0 ? posts : demoReports

  return (
    <>
      {/* ─── HERO CENTRADO ──────────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
          {/* Subtítulo — pill */}
          <span className="inline-block px-5 py-2 mb-6 text-sm text-gray-500 border border-gray-200 rounded-full" style={{ backgroundColor: '#F9F9F8' }}>
            Observatorio Tecnológico CETEC
          </span>

          {/* Título principal */}
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem]  text-gray-900 leading-tight">
            Vigilancia tecnológica<br />
            aplicada a los sectores del<br />
            plástico y el calzado.
          </h1>

          {/* Descripción */}
          <p className="mt-6 text-gray-500 max-w-2xl mx-auto leading-relaxed">
            El Observatorio Tecnológico de CETEC centraliza información
            especializada y actualizada para apoyar la toma de decisiones en
            innovación: noticias, normativa, ayudas, eventos, documentos técnicos,
            formación y soluciones tecnológicas del MarketTech.
          </p>
        </div>
      </section>

      {/* ─── 4 TARJETAS DE SECCIÓN CON GRADIENTES ───────────── */}
      <section className="bg-white pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-6 lg:gap-10">
            {sectionCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative block aspect-[325/312]"
              >
                {/* Capa de desenfoque de fondo (halo difuminado) */}
                <div
                  className="absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-90 pointer-events-none"
                  style={{ background: card.gradient, filter: 'blur(20px)' }}
                />

                {/* Tarjeta principal con gradiente horizontal, sin bordes redondeados ni sombra */}
                <div
                  className="relative w-full h-full overflow-hidden flex flex-col items-center justify-between py-10 px-6 text-center transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{ background: card.gradient }}
                >
                  <h3 className="text-xl  text-white whitespace-pre-line leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-sm text-white/90 leading-relaxed max-w-[220px]">
                    {card.description}
                  </p>
                  <span className="inline-block px-5 py-2 text-xs  text-white bg-white/20 backdrop-blur-sm rounded-full transition-colors duration-300 group-hover:bg-white/30">
                    {card.button}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ÚLTIMOS INFORMES DE VIGILANCIA ─────────────────── */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Cabecera de sección */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl  text-gray-900 leading-tight">
                Últimos informes<br />
                de vigilancia
              </h2>
            </div>
            <Link
              href="/busqueda"
              className="hidden sm:inline-flex px-5 py-2.5 text-sm  text-white bg-gray-900 hover:bg-gray-700 rounded-full transition-colors"
            >
              Ver todos
            </Link>
          </div>

          {/* Grid de tarjetas de informes */}
          <div className="grid md:grid-cols-2 gap-6">
            {reports.map((report) => {
              const date = new Date(report.publishedAt).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
              const secLabel = SECCION_LABELS[report.seccion || ''] || report.category?.name || 'Noticias'
              const sectorLabel = report.sector ? SECTOR_LABELS[report.sector] : null
              return (
                <Link
                  key={report._id}
                  href={`/${report.seccion || report.category?.slug?.current || 'noticias'}/${report.slug.current}`}
                  className="group"
                >
                  <article className="bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all h-full flex flex-col p-5">
                    <div className="flex items-center gap-2 mb-4">
                      {sectorLabel && (
                        <span className="text-[11px]  text-white px-3 py-1 rounded-full" style={{ background: 'linear-gradient(90deg, #FF813B 0%, #FFD4B8 100%)' }}>
                          {sectorLabel}
                        </span>
                      )}
                      <span className="text-[11px]  text-white px-3 py-1 rounded-full" style={{ background: 'linear-gradient(90deg, #5E0360 0%, #C98BCB 100%)' }}>
                        {secLabel}
                      </span>
                    </div>
                    <h3 className=" text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-3 leading-snug">
                      <svg className="inline-block align-[-3px] w-4 h-4 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 18 18">
                        <path d="M3.375 15.75C3.075 15.75 2.8125 15.6375 2.5875 15.4125C2.3625 15.1875 2.25 14.925 2.25 14.625V3.375C2.25 3.075 2.3625 2.8125 2.5875 2.5875C2.8125 2.3625 3.075 2.25 3.375 2.25H12.0375L15.75 5.9625V14.625C15.75 14.925 15.6375 15.1875 15.4125 15.4125C15.1875 15.6375 14.925 15.75 14.625 15.75H3.375ZM3.375 14.625H14.625V6.58931H11.4188V3.375H3.375V14.625ZM5.23125 12.5438H12.7687V11.4188H5.23125V12.5438ZM5.23125 6.58125H9V5.45625H5.23125V6.58125ZM5.23125 9.5625H12.7687V8.4375H5.23125V9.5625Z" />
                      </svg>
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-4 leading-relaxed">
                      <time>{date}</time>
                      {report.excerpt ? ` - ${report.excerpt}` : ''}
                    </p>
                  </article>
                </Link>
              )
            })}
          </div>

          {/* Botón "Ver todos" en móvil */}
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/busqueda"
              className="inline-flex px-6 py-3 text-sm  text-white bg-gray-900 hover:bg-gray-700 rounded-full transition-colors"
            >
              Ver todos
            </Link>
          </div>
        </div>
      </section>

      {/* ─── BLOQUE NEGRO MARKETTECH ────────────────────────── */}
      <section className="relative bg-[#050505] overflow-hidden min-h-[600px] md:min-h-[720px] flex items-center justify-center">
        {/* Cuadro con gradiente lineal: púrpura izq → naranja der (difuminado) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-[340px] h-[380px] md:w-[560px] md:h-[500px] lg:w-[686px] lg:h-[560px]">
            {/* Halo naranja difuminado que sobresale a la derecha */}
            <div
              className="absolute -top-20 -right-40 w-[450px] h-[450px] md:w-[600px] md:h-[600px] rounded-full"
              style={{
                background: 'rgba(255, 91, 0, 0.45)',
                filter: 'blur(130px)',
              }}
            />
            {/* Cuadro principal — relleno más tenue */}
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background: 'linear-gradient(to right, #5E0360 0%, rgba(255, 91, 0, 0.8) 100%)',
              }}
            />
            {/* Difuminado del borde derecho del cuadro (hace que el naranja se desvanezca) */}
            <div
              className="absolute top-0 -right-32 w-56 h-full rounded-full"
              style={{
                background: 'rgba(255, 91, 0, 0.3)',
                filter: 'blur(110px)',
              }}
            />
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36 text-center">
          {/* Badge superior — fondo semi-opaco */}
          <span className="inline-block px-5 py-2 text-xs  text-white bg-white/15 border border-white/20 rounded-full mb-10 backdrop-blur-md">
            Accede a MarketTech
          </span>

          {/* Título — todo blanco */}
          <h2 className="text-3xl md:text-[2.75rem] lg:text-5xl  text-white leading-[1.15] tracking-tight">
            Encuentra soluciones tecnológicas y<br />
            materiales filtrables por tecnología,<br />
            sector, reto y tipo de material.
          </h2>

          {/* Descripción — blanco */}
          <p className="mt-8 text-sm md:text-base text-white/70 max-w-xl mx-auto leading-relaxed">
            MarketTech reúne fichas de soluciones aplicables y materiales
            para ayudar a empresas y profesionales a identificar tecnologías
            útiles para retos como la reducción de residuos, el ahorro
            energético o la mejora de la reciclabilidad.
          </p>

          {/* Botón — fondo negro sólido */}
          <Link
            href="/markettech"
            className="inline-flex items-center gap-2 mt-10 px-7 py-3 text-sm  text-white bg-black border border-white/10 rounded-full hover:bg-gray-900 transition-colors"
          >
            Entrar en MarketTech
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ─── EXPLORAR CONTENIDOS (slider de categorías) ─────── */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Cabecera */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl  text-gray-900 leading-tight">
              Explorar<br />
              contenidos
            </h2>
            <p className="mt-4 text-sm text-gray-500 max-w-md">
              Explora contenidos por tipología: noticias, eventos, normativa, ayudas,
              documentos técnicos, formación, glosario y MarketTech.
            </p>
          </div>

          {/* Slider de categorías */}
          <CategorySlider />
        </div>
      </section>

      {/* ─── SUSCRIPCIÓN A ALERTAS ──────────────────────────── */}
      <section className="bg-white py-12 px-4">
        <div
          className="relative overflow-hidden rounded-3xl py-28 md:py-36"
          style={{ backgroundColor: '#F0F0F0' }}
        >
          {/* Patrón de círculos en cuadrícula cubriendo todo el fondo */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='38' fill='none' stroke='%23D9D0F7' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: '80px 80px',
            }}
          />

          {/* Círculo gradiente central — naranja #FF5B00 → morado #BD87BE */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div
              className="w-[480px] h-[480px] md:w-[600px] md:h-[600px] rounded-full"
              style={{
                background: 'radial-gradient(circle, #FF5B00 0%, #BD87BE 43%, transparent 70%)',
              }}
            />
          </div>

          {/* Contenido centrado dentro del círculo */}
          <div className="relative z-10 max-w-lg mx-auto px-4 text-center">
          {/* Badge */}
          <span className="inline-block px-5 py-2 text-xs bg-white rounded-full mb-8" style={{ color: '#000000' }}>
            Suscripción
          </span>

          <h2 className="text-3xl md:text-4xl leading-tight" style={{ color: '#FFFFFF', mixBlendMode: 'difference' }}>
            Suscríbete a<br />
            nuestras alertas
          </h2>

          <p className="mt-4 text-sm max-w-sm mx-auto leading-relaxed" style={{ color: '#FFFFFF', mixBlendMode: 'difference' }}>
            Recibe por correo las novedades del Observatorio según tus
            intereses: ayudas, eventos, normativa, documentos y soluciones
            MarketTech, con opción de seleccionar sector (plástico / calzado).
          </p>

          {/* Formulario de suscripción */}
          <form className="mt-8 flex items-stretch max-w-md mx-auto bg-white rounded-md overflow-hidden">
            <input
              type="email"
              placeholder="Email"
              className="flex-1 px-5 py-3 text-sm focus:outline-none bg-white placeholder-gray-400 min-w-0"
              style={{ color: '#000000' }}
            />
            <button
              type="submit"
              className="px-7 py-3 text-sm text-white transition-colors whitespace-nowrap flex-shrink-0"
              style={{ backgroundColor: '#000000' }}
            >
              Suscríbete
            </button>
          </form>
        </div>
        </div>
      </section>
    </>
  )
}
