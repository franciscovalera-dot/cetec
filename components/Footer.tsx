/**
 * Footer oscuro con logo CETEC, columnas de enlaces y copyright
 * Estructura según mockup: logo+descripción | Acceso directo | Acceder contenido | CETEC
 */
import Link from 'next/link'

type FooterLink = { href: string; label: string; external?: boolean }

const columns: { title: string; links: FooterLink[] }[] = [
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
      { href: '/markettech/soluciones', label: 'MarketTech · Soluciones tecnológicas' },
      { href: '/markettech', label: 'Base de datos de materiales' },
      { href: '/#suscripcion', label: 'Suscripción a alertas tecnológicas' },
    ],
  },
  {
    title: 'CETEC',
    links: [
      { href: 'https://ceteccentrotecnologico.org/', label: 'Web de CETEC', external: true },
      { href: '/privacidad', label: 'Política de privacidad' },
      { href: 'https://ceteccentrotecnologico.org/servicios-a-empresas/', label: 'Servicios tecnológicos', external: true },
      { href: '/contacto', label: 'Contacto' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
                {col.links.map((link) =>
                  link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* ─── Separador y copyright ──────────────────────── */}
        <div className="mt-16 pt-8 border-t border-gray-800 grid grid-cols-1 sm:grid-cols-3 items-center gap-4 text-xs text-gray-600">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} CETEC – Centro Tecnológico del Calzado y el Plástico
          </p>
          <p className="text-center">Todos los derechos reservados</p>
          <p className="text-center sm:text-right">diseñado por chillypills</p>
        </div>
      </div>
    </footer>
  )
}
