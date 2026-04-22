/**
 * PÁGINA DE CONTACTO
 */
import Link from 'next/link'
import ContactForm from '@/components/ContactForm'

export const metadata = { title: 'Contacto' }

export default function ContactoPage() {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-10">
        <Link href="/" className="hover:text-gray-600 transition-colors">Inicio</Link>
        <span>›</span>
        <span className="text-gray-600">Contacto</span>
      </nav>

      {/* Layout: info izquierda + formulario derecha */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

        {/* ─── Columna izquierda ─────────────────────────── */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <h1 className="text-4xl  text-gray-900 mb-6">Contacto</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-10">
            Si deseas obtener más información sobre el Observatorio Tecnológico de CETEC,
            realizar alguna consulta o ponerte en contacto con nuestro equipo,
            puedes hacerlo a través del siguiente formulario.
          </p>

          <div className="space-y-6">
            {/* Dirección */}
            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm text-gray-500 leading-relaxed">
                Polígono Industrial Las Salinas,<br />
                Avenida Europa 4-5, 30840 Alhama<br />
                de Murcia – Murcia (España)
              </p>
            </div>

            {/* Teléfono */}
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-sm text-gray-500">+34 968 63 22 00</span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:info@ctcalzado.org" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                info@ctcalzado.org
              </a>
            </div>
          </div>
        </div>

        {/* ─── Columna derecha: formulario ───────────────── */}
        <div className="w-full lg:flex-1 lg:max-w-xl bg-[#F9F9F8] rounded-2xl p-6 sm:p-8 lg:ml-auto">
          <p className="text-xl  text-gray-700 leading-snug mb-8">
            ¿Tienes alguna consulta sobre innovación tecnológica o los contenidos del observatorio? Estamos aquí para ayudarte.
          </p>

          <ContactForm />
        </div>

      </div>
    </div>
  )
}
