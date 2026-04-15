/**
 * Slider infinito de categorías para "Explorar contenidos"
 * Duplica los items para crear el efecto de loop sin fin
 */
'use client'

import { useRef, useCallback } from 'react'
import Link from 'next/link'

// Categorías del slider con iconos SVG path
const categories = [
  {
    href: '/noticias',
    title: 'Noticias',
    icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
  },
  {
    href: '/agenda',
    title: 'Agenda /\nEventos',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    href: '/documentos',
    title: 'Documentos\ntécnicos',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  },
  {
    href: '/normativa',
    title: 'Normativa /\nLegislación',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    href: '/ayudas',
    title: 'Ayudas /\nSubvenciones',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  {
    href: '/glosario',
    title: 'Glosario',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    href: '/formacion',
    title: 'Formación /\nCursos',
    icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222',
  },
  {
    href: '/markettech',
    title: 'MarketTech',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
]

// Ancho de cada tarjeta + gap (190px + 16px gap)
const ITEM_WIDTH = 206
const TOTAL_WIDTH = categories.length * ITEM_WIDTH

// Tarjeta individual extraída para reutilizar en las copias
function CategoryCard({ cat }: { cat: (typeof categories)[number] }) {
  return (
    <Link
      href={cat.href}
      className="group flex-shrink-0 w-[190px]"
    >
      <div className="relative h-[230px] rounded-2xl border border-gray-200 bg-white p-6 flex flex-col items-center justify-between text-center overflow-hidden transition-all duration-300 group-hover:border-orange-400 group-hover:bg-gradient-to-b group-hover:from-orange-400 group-hover:to-orange-600 group-hover:shadow-xl">
        {/* Título arriba */}
        <h3 className="text-base font-bold text-gray-900 whitespace-pre-line leading-snug group-hover:text-white transition-colors pt-2">
          {cat.title}
        </h3>

        {/* Icono de categoría en el medio */}
        <svg
          className="w-6 h-6 text-gray-400 group-hover:text-white/80 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={cat.icon} />
        </svg>

        {/* Círculo con flecha diagonal abajo */}
        <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-white/50 group-hover:bg-white/20 transition-all">
          <svg
            className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

export default function CategorySlider() {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Al hacer scroll, si llega al final salta al principio y viceversa
  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    // Si se pasó del set duplicado de la derecha, volver al set original
    if (el.scrollLeft >= TOTAL_WIDTH * 2) {
      el.scrollLeft -= TOTAL_WIDTH
    }
    // Si se pasó del set duplicado de la izquierda, avanzar al set original
    if (el.scrollLeft <= 0) {
      el.scrollLeft += TOTAL_WIDTH
    }
  }, [])

  // Desplazar con flechas
  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction === 'left' ? -ITEM_WIDTH * 2 : ITEM_WIDTH * 2, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      {/* Flechas de navegación */}
      <div className="absolute -top-14 right-0 flex items-center gap-2">
        <button
          onClick={() => scroll('left')}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Anterior"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => scroll('right')}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Siguiente"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Slider infinito: 3 copias del set (izq + original + der) */}
      <div
        ref={(el) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (scrollRef as any).current = el
          // Posicionar inicialmente en el set del medio
          if (el && el.scrollLeft === 0) {
            el.scrollLeft = TOTAL_WIDTH
          }
        }}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Copia izquierda */}
        {categories.map((cat, i) => (
          <CategoryCard key={`left-${i}`} cat={cat} />
        ))}
        {/* Set original */}
        {categories.map((cat, i) => (
          <CategoryCard key={`mid-${i}`} cat={cat} />
        ))}
        {/* Copia derecha */}
        {categories.map((cat, i) => (
          <CategoryCard key={`right-${i}`} cat={cat} />
        ))}
      </div>
    </div>
  )
}
