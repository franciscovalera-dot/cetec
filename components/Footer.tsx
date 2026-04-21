/**
 * Footer oscuro con logo CETEC, columnas de enlaces y copyright
 * Estructura según mockup: logo+descripción | Acceso directo | Acceder contenido | CETEC
 */
import Link from 'next/link'

const columns = [
  {
    title: 'Acceso directo',
    links: [
      { href: '/noticias', label: 'Noticias' },
      { href: '/ayudas', label: 'Ayudas y Subvenciones' },
      { href: '/normativa', label: 'Normativa · Legislación' },
      { href: '/documentos', label: 'Documentos · Técnicos' },
      { href: '/agenda', label: 'Agenda · Eventos' },
      { href: '/formacion', label: 'Formación · Cursos' },
      { href: '/markettech', label: 'MarketTech' },
    ],
  },
  {
    title: 'Acceder contenido',
    links: [
      { href: '/busqueda', label: 'Buscador tecnológico' },
      { href: '/markettech', label: 'MarketTech · Soluciones tecnológicas' },
      { href: '/markettech', label: 'Base de datos de materiales' },
      { href: '#suscripcion', label: 'Suscripción a alertas tecnológicas' },
    ],
  },
  {
    title: 'CETEC',
    links: [
      { href: '#', label: 'Web de CETEC' },
      { href: '#', label: 'Política de privacidad' },
      { href: '#', label: 'Servicios tecnológicos' },
      { href: '/contacto', label: 'Contacto' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* ─── Logo + descripción (ocupa 2 columnas) ────── */}
          <div className="lg:col-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-cetec.png"
              alt="CETEC Centro Tecnológico"
              width={210}
              height={58}
              className="block mb-5"
            />
            <p className="text-lg  text-white leading-snug mb-4">
              Observatorio<br />
              Tecnológico CETEC
            </p>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              El Observatorio Tecnológico de CETEC recopila y
              difunde información especializada sobre innovación,
              materiales y procesos en los sectores del plástico y
              el calzado industriales y de calzado.
            </p>
          </div>

          {/* ─── Columnas de enlaces ──────────────────────── */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs  text-gray-500 uppercase tracking-widest mb-5">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ─── Separador y copyright ──────────────────────── */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} CETEC — Observatorio Tecnológico. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-5">
            {/* Twitter/X */}
            <a href="#" className="text-gray-600 hover:text-orange-400 transition-colors" aria-label="Twitter">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="text-gray-600 hover:text-orange-400 transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
