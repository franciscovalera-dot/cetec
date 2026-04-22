/**
 * Página de Política de Privacidad
 *
 * AVISO IMPORTANTE: Este texto es una PLANTILLA base redactada según
 * la estructura habitual del RGPD (UE) 2016/679 y la LOPDGDD (España).
 * Revísalo con un asesor legal antes de publicarlo en producción para
 * asegurar que se ajusta a la realidad del tratamiento de datos de CETEC.
 */
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description:
    'Política de privacidad del Observatorio Tecnológico CETEC — información sobre el tratamiento de tus datos personales.',
}

export default function PoliticaPrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-10">
        <Link href="/" className="hover:text-gray-600 transition-colors">Inicio</Link>
        <span>›</span>
        <span className="text-gray-600">Política de privacidad</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl text-gray-900 leading-tight mb-4">
          Política de privacidad
        </h1>
        <p className="text-sm text-gray-500">
          Última actualización: 22 de abril de 2026
        </p>
      </header>

      <div className="space-y-10 text-gray-700 leading-relaxed text-[15px]">

        <section>
          <h2 className="text-xl text-gray-900 mb-3">1. Responsable del tratamiento</h2>
          <p>
            El responsable del tratamiento de los datos personales recogidos a través de este sitio
            web es <strong>CETEC – Centro Tecnológico del Calzado y el Plástico</strong>.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-gray-600">
            <li><strong>Dirección:</strong> Polígono Industrial Las Salinas, Avenida Europa 4-5, 30840 Alhama de Murcia – Murcia (España)</li>
            <li><strong>Teléfono:</strong> +34 968 63 22 00</li>
            <li><strong>Email:</strong> <a href="mailto:info@ctcalzado.org" className="text-gray-900 underline hover:text-orange-600">info@ctcalzado.org</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl text-gray-900 mb-3">2. Datos que recopilamos y finalidades</h2>
          <p className="mb-3">
            Este sitio web recoge datos personales únicamente cuando el usuario los facilita
            voluntariamente a través de los siguientes canales:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Formulario de contacto</strong> (<Link href="/contacto" className="text-gray-900 underline hover:text-orange-600">/contacto</Link>):
              nombre, apellidos, empresa, correo electrónico, teléfono, asunto y mensaje.
              <br />
              <span className="text-sm text-gray-500">Finalidad: atender tu consulta y responderte.</span>
            </li>
            <li>
              <strong>Suscripción al newsletter</strong> (formulario de la home): correo electrónico.
              <br />
              <span className="text-sm text-gray-500">Finalidad: enviarte comunicaciones periódicas con novedades del Observatorio.</span>
            </li>
            <li>
              <strong>Alertas de búsqueda</strong> (desde el buscador): correo electrónico y
              criterios de búsqueda (texto, sección, temática, sector, idioma).
              <br />
              <span className="text-sm text-gray-500">Finalidad: avisarte por email cuando se publique contenido que coincida con tus criterios.</span>
            </li>
          </ul>
          <p className="mt-3 text-sm text-gray-500">
            No se recopilan categorías especiales de datos (salud, ideología, etc.). No se realizan
            tratamientos automatizados que produzcan decisiones con efectos jurídicos sobre el usuario.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-gray-900 mb-3">3. Base legal</h2>
          <p>
            La base legal del tratamiento es el <strong>consentimiento</strong> del interesado otorgado
            al enviar cualquiera de los formularios (art. 6.1.a del RGPD), y la ejecución de medidas
            precontractuales o la atención de la consulta en el caso del formulario de contacto
            (art. 6.1.b del RGPD).
          </p>
        </section>

        <section>
          <h2 className="text-xl text-gray-900 mb-3">4. Plazo de conservación</h2>
          <p>
            Los datos se conservarán durante el tiempo necesario para cumplir la finalidad para la
            que fueron recabados y, en su caso, durante los plazos exigidos por la legislación
            aplicable. El usuario puede solicitar la baja en cualquier momento (ver sección 7).
          </p>
        </section>

        <section>
          <h2 className="text-xl text-gray-900 mb-3">5. Destinatarios y encargados de tratamiento</h2>
          <p className="mb-3">
            No se cederán datos a terceros salvo obligación legal. Para el funcionamiento técnico del
            sitio web, los datos pueden ser tratados por los siguientes <strong>encargados del
            tratamiento</strong>, con los que existen contratos conformes al art. 28 del RGPD:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Sanity.io</strong> (contenido y almacenamiento de formularios) — servidor
              ubicado en la UE / EE. UU. bajo el marco de transferencias internacionales adecuadas.
            </li>
            <li>
              <strong>Google reCAPTCHA</strong> (verificación anti-bot en los formularios): al enviar
              un formulario se remiten a Google datos técnicos (IP, información del navegador, cookies
              de Google) para determinar si se trata de un humano. Más información en la{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gray-900 underline hover:text-orange-600">
                política de privacidad de Google
              </a>.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl text-gray-900 mb-3">6. Seguridad</h2>
          <p>
            Se aplican medidas técnicas y organizativas apropiadas para proteger los datos
            personales frente a accesos no autorizados, pérdida, alteración o divulgación. Las
            comunicaciones con el sitio se realizan mediante HTTPS.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-gray-900 mb-3">7. Derechos del usuario</h2>
          <p className="mb-3">
            En cualquier momento puedes ejercer los siguientes derechos sobre tus datos personales:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Acceso</strong>: conocer qué datos tratamos sobre ti.</li>
            <li><strong>Rectificación</strong>: corregir datos inexactos o incompletos.</li>
            <li><strong>Supresión</strong> (derecho al olvido): solicitar su eliminación.</li>
            <li><strong>Limitación</strong> del tratamiento en los casos previstos por la ley.</li>
            <li><strong>Oposición</strong> al tratamiento.</li>
            <li><strong>Portabilidad</strong> de los datos a otro responsable.</li>
            <li><strong>Revocar el consentimiento</strong> en cualquier momento, sin efectos retroactivos.</li>
          </ul>
          <p className="mt-3">
            Puedes ejercer estos derechos enviando un correo a{' '}
            <a href="mailto:info@ctcalzado.org" className="text-gray-900 underline hover:text-orange-600">
              info@ctcalzado.org
            </a>{' '}
            indicando el derecho que deseas ejercer y adjuntando copia de un documento acreditativo
            de tu identidad.
          </p>
          <p className="mt-3">
            Asimismo, tienes derecho a presentar una reclamación ante la{' '}
            <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-gray-900 underline hover:text-orange-600">
              Agencia Española de Protección de Datos (AEPD)
            </a>{' '}
            si consideras que el tratamiento de tus datos personales no es conforme a la normativa.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-gray-900 mb-3">8. Cookies</h2>
          <p>
            Este sitio web puede utilizar cookies técnicas necesarias para su funcionamiento, así
            como cookies de terceros (Google reCAPTCHA) cuando el usuario interactúa con los
            formularios. Para más detalle, consulta en su caso la política de cookies específica.
          </p>
        </section>

        <section>
          <h2 className="text-xl text-gray-900 mb-3">9. Modificaciones</h2>
          <p>
            Esta política podrá ser actualizada para adaptarse a cambios legislativos o de los
            servicios ofrecidos. La versión vigente será siempre la publicada en esta página, con
            indicación de la fecha de última actualización al inicio del documento.
          </p>
        </section>

      </div>
    </div>
  )
}
