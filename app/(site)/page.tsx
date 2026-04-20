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
      '06/04/2026 · A global plastics-to-power tool named has brought the production of two critical thermoset engine components in-house at its US plant to stabilize dimensional accuracy and functional quality. Chemie...',
    publishedAt: '2026-04-06',
    slug: { current: 'purecycle-toppan-partnership' },
    category: { name: 'Noticias', slug: { current: 'noticias' }, color: '#F97316' },
  },
  {
    _id: 'demo-2',
    title: 'PureCycle and TOPPAN establish partnership to deliver sustainable packaging solutions with recycled content',
    excerpt:
      '06/04/2026 · A global plastics-to-power tool named has brought the production of two critical thermoset engine components in-house at its US plant to stabilize dimensional accuracy and functional quality. Chemie...',
    publishedAt: '2026-04-06',
    slug: { current: 'purecycle-toppan-partnership-2' },
    category: { name: 'Noticias', slug: { current: 'noticias' }, color: '#F97316' },
  },
]

// Las 4 tarjetas de sección — gradientes vibrantes con glow difuminado y perspectiva
const sectionCards = [
  {
    href: '/noticias',
    title: 'Noticias',
    description: 'Novedades del sector, innovación y actualidad tecnológica.',
    button: 'Ver noticias',
    gradient: 'linear-gradient(135deg, #FF8A3B 0%, #FF6B1A 40%, #E85D10 100%)',
    glow: 'rgba(255, 138, 59, 0.5)',
    skew: '-2deg',
  },
  {
    href: '/normativa',
    title: 'Normativa y\nLegislación',
    description: 'Cambios normativos relevantes y fechas de entrada en vigor.',
    button: 'Ver normativa',
    gradient: 'linear-gradient(135deg, #E8457C 0%, #C2185B 40%, #9B1B5E 100%)',
    glow: 'rgba(232, 69, 124, 0.45)',
    skew: '-1deg',
  },
  {
    href: '/formacion',
    title: 'Formación\ny Cursos',
    description: 'Formación especializada para empresas y profesionales del sector.',
    button: 'Ver formación',
    gradient: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 40%, #5E1287 100%)',
    glow: 'rgba(156, 39, 176, 0.45)',
    skew: '1deg',
  },
  {
    href: '/ayudas',
    title: 'Ayudas y\nSubvenciones',
    description: 'Convocatorias abiertas y oportunidades de financiación.',
    button: 'Ver todas las ayudas',
    gradient: 'linear-gradient(135deg, #5C6BC0 0%, #3F51B5 40%, #283593 100%)',
    glow: 'rgba(92, 107, 192, 0.45)',
    skew: '2deg',
  },
]

export default async function HomePage() {
  // Intentar obtener posts reales de Sanity
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let posts: any[] = []
  try {
    posts = await getLatestPosts(4)
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
          {/* Subtítulo */}
          <p className="text-sm text-gray-400 tracking-widest uppercase mb-6">
            Observatorio Tecnológico CETEC
          </p>

          {/* Título principal */}
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-gray-900 leading-tight">
            Vigilancia tecnológica<br />
            aplicada a los sectores del<br />
            plástico y el calzado.
          </h1>

          {/* Descripción */}
          <p className="mt-6 text-gray-500 max-w-2xl mx-auto leading-relaxed">
            El Observatorio Tecnológico de CETEC centraliza información
            estratégica sobre materiales, procesos, sostenibilidad e
            innovación: noticias, normativa, ayudas, eventos, documentos técnicos,
            formación y soluciones tecnológicas del marketplace.
          </p>
        </div>
      </section>

      {/* ─── 4 TARJETAS DE SECCIÓN CON GRADIENTES ───────────── */}
      <section className="bg-white pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sectionCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative"
              >
                {/* Glow difuminado que sobresale de la tarjeta */}
                <div
                  className="absolute -inset-4 rounded-[2rem] opacity-50 blur-2xl transition-opacity duration-500 group-hover:opacity-75 pointer-events-none"
                  style={{ background: card.glow }}
                />

                {/* Tarjeta principal con perspectiva/skew */}
                <div
                  className="relative aspect-[4/5] rounded-2xl overflow-hidden p-6 flex flex-col items-center justify-center text-center transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-2xl"
                  style={{
                    background: card.gradient,
                    transform: `perspective(800px) rotateY(${card.skew})`,
                  }}
                >
                  {/* Capa glassmorphism sutil */}
                  <div className="absolute inset-0 rounded-2xl bg-white/5 backdrop-blur-[1px] pointer-events-none" />

                  {/* Reflejo de luz en la esquina superior izquierda */}
                  <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/20 rounded-full blur-3xl pointer-events-none" />

                  {/* Brillo inferior derecho */}
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Contenido */}
                  <div className="relative z-10 flex flex-col items-center">
                    <h3 className="text-xl font-bold text-white whitespace-pre-line leading-tight drop-shadow-sm">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm text-white/80 leading-relaxed max-w-[190px]">
                      {card.description}
                    </p>
                    <span className="mt-6 inline-block px-5 py-2 text-xs font-semibold text-white bg-white/15 border border-white/30 rounded-full backdrop-blur-sm transition-all duration-300 group-hover:bg-white/25 group-hover:scale-105 group-hover:shadow-lg">
                      {card.button}
                    </span>
                  </div>
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Últimos informes<br />
                de vigilancia
              </h2>
            </div>
            <Link
              href="/busqueda"
              className="hidden sm:inline-flex px-5 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 rounded-full transition-colors"
            >
              Ver todos
            </Link>
          </div>

          {/* Grid de tarjetas de informes */}
          <div className="grid md:grid-cols-2 gap-6">
            {reports.map((report) => (
              <Link
                key={report._id}
                href={`/${report.category?.slug?.current || 'noticias'}/${report.slug.current}`}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Barra superior naranja */}
                <div className="h-1 bg-gradient-to-r from-orange-400 to-orange-600" />

                <div className="p-6 sm:p-8">
                  {/* Badge de categoría */}
                  {report.category && (
                    <span
                      className="inline-block text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-4"
                      style={{
                        color: report.category.color,
                        backgroundColor: `${report.category.color}15`,
                      }}
                    >
                      {report.category.name}
                    </span>
                  )}

                  {/* Título del informe */}
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors leading-snug">
                    {report.title}
                  </h3>

                  {/* Extracto */}
                  {report.excerpt && (
                    <p className="mt-3 text-sm text-gray-500 leading-relaxed line-clamp-3">
                      {report.excerpt}
                    </p>
                  )}

                  {/* Leer más */}
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-orange-600 group-hover:text-orange-700">
                    Leer más
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Botón "Ver todos" en móvil */}
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/busqueda"
              className="inline-flex px-6 py-3 text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 rounded-full transition-colors"
            >
              Ver todos
            </Link>
          </div>
        </div>
      </section>

      {/* ─── BLOQUE NEGRO MARKETTECH ────────────────────────── */}
      <section className="relative bg-[#050505] overflow-hidden min-h-[600px] md:min-h-[720px] flex items-center justify-center">
        {/* Cuadro decorativo — gradiente púrpura izq → naranja der, difuminado a la derecha */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-[340px] h-[380px] md:w-[560px] md:h-[500px] lg:w-[650px] lg:h-[560px]">
            {/* Halo naranja difuso hacia la derecha */}
            <div className="absolute -top-16 -right-32 w-80 h-80 md:w-[400px] md:h-[400px] bg-orange-600/20 rounded-full blur-[100px]" />
            {/* Cuadro principal: púrpura izq → naranja der */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-800 via-rose-600 to-orange-500" />
            {/* Brillo púrpura en esquina izquierda */}
            <div className="absolute -top-4 -left-4 w-48 h-48 md:w-64 md:h-64 bg-purple-700/50 rounded-full blur-[60px]" />
            {/* Brillo naranja fuerte en esquina derecha — difumina el borde */}
            <div className="absolute -bottom-6 -right-6 w-56 h-56 md:w-72 md:h-72 bg-orange-500/50 rounded-full blur-[70px]" />
            {/* Borde derecho extra difuminado para que se desvanezca */}
            <div className="absolute top-0 -right-16 w-40 h-full bg-orange-500/30 blur-[80px] rounded-full" />
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36 text-center">
          {/* Badge superior — fondo semi-opaco */}
          <span className="inline-block px-5 py-2 text-xs font-medium text-white bg-white/15 border border-white/20 rounded-full mb-10 backdrop-blur-md">
            Accede a MarketTech
          </span>

          {/* Título — todo blanco */}
          <h2 className="text-3xl md:text-[2.75rem] lg:text-5xl font-bold text-white leading-[1.15] tracking-tight">
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
            className="inline-flex items-center gap-2 mt-10 px-7 py-3 text-sm font-medium text-white bg-black border border-white/10 rounded-full hover:bg-gray-900 transition-colors"
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
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
      <section
        className="relative overflow-hidden py-28 md:py-36"
        style={{ backgroundColor: '#DFDFDF' }}
      >
        {/* Patrón de círculos en cuadrícula cubriendo todo el fondo */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='38' fill='none' stroke='%23c8c8c8' stroke-width='1'/%3E%3C/svg%3E")`,
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
          <span className="inline-block px-5 py-2 text-xs font-medium text-white bg-white/20 border border-white/30 rounded-full mb-8 backdrop-blur-sm">
            Suscripciones
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Suscríbete a<br />
            nuestras alertas
          </h2>

          <p className="mt-4 text-sm text-white/80 max-w-sm mx-auto leading-relaxed">
            Recibe en tu correo las novedades del Observatorio: noticias,
            normativa, ayudas, eventos, formación, documentos del sector
            plástico y calzado.
          </p>

          {/* Formulario de suscripción */}
          <form className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email"
              className="flex-1 w-full px-5 py-3 text-sm border border-white/30 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent bg-white/90 text-gray-900 placeholder-gray-400"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              Suscríbete
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
