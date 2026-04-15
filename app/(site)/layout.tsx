/**
 * Layout principal del sitio (rutas públicas)
 */
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Observatorio Tecnológico CETEC',
    template: '%s | Observatorio Tecnológico',
  },
  description:
    'Portal de divulgación científica y tecnológica. Noticias, normativa, documentación y recursos para profesionales.',
}

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
