/**
 * Slider de categorías para "Explorar contenidos"
 * Avanza de 1 en 1, loop infinito con autoplay cada 5s
 */
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'

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

// Ancho tarjeta + gap
const CARD_W = 190
const GAP = 16
const STEP = CARD_W + GAP

function CategoryCard({ cat }: { cat: (typeof categories)[number] }) {
  return (
    <Link href={cat.href} className="group flex-shrink-0 w-[190px]">
      <div className="relative h-[230px] rounded-2xl border border-gray-200 bg-white p-6 flex flex-col items-center justify-between text-center overflow-hidden transition-all duration-300 group-hover:border-orange-400 group-hover:bg-gradient-to-b group-hover:from-orange-400 group-hover:to-orange-600 group-hover:shadow-xl">
        <h3 className="text-base font-bold text-gray-900 whitespace-pre-line leading-snug group-hover:text-white transition-colors pt-2">
          {cat.title}
        </h3>
        <svg className="w-6 h-6 text-gray-400 group-hover:text-white/80 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={cat.icon} />
        </svg>
        <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-white/50 group-hover:bg-white/20 transition-all">
          <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

export default function CategorySlider() {
  const total = categories.length
  // Indice interno sobre el array triplicado (empieza en el set del medio)
  const [index, setIndex] = useState(total)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const trackRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Triplicar para el efecto de loop infinito
  const items = [...categories, ...categories, ...categories]

  const goTo = useCallback((newIndex: number) => {
    setIsTransitioning(true)
    setIndex(newIndex)
  }, [])

  const next = useCallback(() => goTo(index + 1), [index, goTo])
  const prev = useCallback(() => goTo(index - 1), [index, goTo])

  // Cuando la transicion termina, si estamos fuera del set del medio, saltar sin animacion
  const handleTransitionEnd = useCallback(() => {
    if (index >= total * 2) {
      setIsTransitioning(false)
      setIndex(total)
    } else if (index < total) {
      setIsTransitioning(false)
      setIndex(total * 2 - 1)
    }
  }, [index, total])

  // Autoplay cada 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true)
      setIndex((prev: number) => prev + 1)
    }, 5000)
    timerRef.current = timer
    return () => clearInterval(timer)
  }, [])

  // Pausar autoplay al interactuar, reanudar al salir
  const pauseAutoplay = () => {
    if (timerRef.current) clearInterval(timerRef.current)
  }
  const resumeAutoplay = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIsTransitioning(true)
      setIndex((prev: number) => prev + 1)
    }, 5000)
  }

  const handlePrev = () => {
    pauseAutoplay()
    prev()
    resumeAutoplay()
  }

  const handleNext = () => {
    pauseAutoplay()
    next()
    resumeAutoplay()
  }

  return (
    <div
      className="relative"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      {/* Flechas */}
      <div className="absolute -top-14 right-0 flex items-center gap-2">
        <button
          onClick={handlePrev}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Anterior"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Siguiente"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Track del slider */}
      <div className="overflow-hidden -mx-4 px-4">
        <div
          ref={trackRef}
          className="flex gap-4"
          style={{
            transform: `translateX(-${index * STEP}px)`,
            transition: isTransitioning ? 'transform 400ms ease-in-out' : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {items.map((cat, i) => (
            <CategoryCard key={i} cat={cat} />
          ))}
        </div>
      </div>
    </div>
  )
}
