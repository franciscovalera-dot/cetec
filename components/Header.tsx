/**
 * Componente Header con navegación principal
 * Nav: Logo | Inicio | Buscador | Contenido (dropdown) | Glosario | Marketech | [Contacto botón]
 */
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef } from 'react'

// Subenlaces dentro del desplegable "Contenido"
const contentLinks = [
  { href: '/noticias', label: 'Noticias', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  { href: '/normativa', label: 'Normativa', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { href: '/agenda', label: 'Agenda / Eventos', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { href: '/formacion', label: 'Formación / Cursos', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { href: '/documentos', label: 'Documentos técnicos', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  { href: '/ayudas', label: 'Ayudas y subvenciones', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
]

export default function Header() {
  const [contentOpen, setContentOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileContentOpen, setMobileContentOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)


  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* ─── Logo ─────────────────────────────────────── */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="Observatorio Tecnológico"
              width={151}
              height={65}
              priority
            />
          </Link>

          {/* ─── Navegación desktop ───────────────────────── */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Inicio */}
            <Link
              href="/"
              className="px-4 py-2 text-sm  text-gray-700 hover:text-orange-600 transition-colors"
            >
              Inicio
            </Link>

            {/* Buscador */}
            <Link
              href="/busqueda"
              className="px-4 py-2 text-sm  text-gray-700 hover:text-orange-600 transition-colors"
            >
              Buscador
            </Link>

            {/* Contenido (dropdown) */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setContentOpen(true)}
              onMouseLeave={() => setContentOpen(false)}
            >
              <button
                className="flex items-center gap-1 px-4 py-2 text-sm  text-gray-700 hover:text-orange-600 transition-colors"
              >
                Contenido
                {/* Flecha desplegable */}
                <svg
                  className={`w-4 h-4 transition-transform ${contentOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Panel desplegable */}
              {contentOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[480px] z-50 pt-2">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div className="grid grid-cols-2 gap-3">
                      {contentLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setContentOpen(false)}
                          className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 transition-colors"
                        >
                          <svg
                            className="w-5 h-5 text-gray-400 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                          </svg>
                          <span className="">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Glosario */}
            <Link
              href="/glosario"
              className="px-4 py-2 text-sm  text-gray-700 hover:text-orange-600 transition-colors"
            >
              Glosario
            </Link>

            {/* Marketech */}
            <Link
              href="/markettech"
              className="px-4 py-2 text-sm  text-gray-700 hover:text-orange-600 transition-colors"
            >
              Marketech
            </Link>
          </nav>

          {/* ─── Botón Contacto (derecha, desktop) ────────── */}
          <Link
            href="/contacto"
            className="hidden lg:inline-flex px-6 py-2.5 text-sm  text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-colors"
          >
            Contacto
          </Link>

          {/* ─── Botón menú móvil ─────────────────────────── */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ─── Menú móvil ─────────────────────────────────── */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-gray-200 bg-white pb-4">
          <div className="px-4 pt-3 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm  text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Inicio
            </Link>
            <Link
              href="/busqueda"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm  text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Buscador
            </Link>

            {/* Contenido desplegable en móvil */}
            <div>
              <button
                onClick={() => setMobileContentOpen(!mobileContentOpen)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm  text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Contenido
                <svg
                  className={`w-4 h-4 transition-transform ${mobileContentOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileContentOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {contentLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => { setMobileOpen(false); setMobileContentOpen(false) }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-gray-50 rounded-md"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                      </svg>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/glosario"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm  text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Glosario
            </Link>
            <Link
              href="/markettech"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm  text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Marketech
            </Link>
            <Link
              href="/contacto"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm  text-white bg-gray-900 rounded-full text-center mt-3"
            >
              Contacto
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
