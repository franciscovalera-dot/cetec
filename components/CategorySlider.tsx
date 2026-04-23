/**
 * Slider de categorías para "Explorar contenidos"
 * Avanza de 1 en 1, loop infinito con autoplay cada 5s
 */
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'

type IconKey = 'news' | 'calendar' | 'pen' | 'chat' | 'bank' | 'newspapers' | 'office' | 'paper' | 'folder'

interface Category {
  href: string
  title: string
  icon: IconKey
}

const categories: Category[] = [
  { href: '/noticias',   title: 'Noticias',                 icon: 'newspapers' },
  { href: '/agenda',     title: 'Agenda /\nEventos',        icon: 'calendar' },
  { href: '/documentos', title: 'Documentos\ntécnicos',     icon: 'pen' },
  { href: '/normativa',  title: 'Normativa /\nLegislación', icon: 'chat' },
  { href: '/ayudas',     title: 'Ayudas /\nSubvenciones',   icon: 'bank' },
  { href: '/glosario',   title: 'Glosario',                 icon: 'folder' },
  { href: '/formacion',  title: 'Formación /\nCursos',      icon: 'office' },
  { href: '/markettech', title: 'MarketTech',               icon: 'paper' },
]

function CategoryIcon({ name }: { name: IconKey }) {
  // News usa fill; el resto usa stroke. En ambos casos heredan currentColor.
  if (name === 'news') {
    return (
      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 18 18">
        <path d="M3.375 15.75C3.075 15.75 2.8125 15.6375 2.5875 15.4125C2.3625 15.1875 2.25 14.925 2.25 14.625V3.375C2.25 3.075 2.3625 2.8125 2.5875 2.5875C2.8125 2.3625 3.075 2.25 3.375 2.25H12.0375L15.75 5.9625V14.625C15.75 14.925 15.6375 15.1875 15.4125 15.4125C15.1875 15.6375 14.925 15.75 14.625 15.75H3.375ZM3.375 14.625H14.625V6.58931H11.4188V3.375H3.375V14.625ZM5.23125 12.5438H12.7687V11.4188H5.23125V12.5438ZM5.23125 6.58125H9V5.45625H5.23125V6.58125ZM5.23125 9.5625H12.7687V8.4375H5.23125V9.5625Z" />
      </svg>
    )
  }
  const paths: Record<Exclude<IconKey, 'news'>, React.ReactNode> = {
    calendar: (
      <path d="M8.74992 7.00008V1.16675M20.4166 7.00008V1.16675M25.0833 19.8334V25.0834H4.08325V21.5834M24.9234 9.91675H3.91059M0.583252 21.2917V21.5834H21.4666L21.6416 21.2917L21.9146 20.7189C24.0008 16.3342 25.0833 11.5396 25.0833 6.68391V4.08341H4.08325V6.56608C4.0833 11.4593 2.98407 16.29 0.866752 20.7014L0.583252 21.2917Z" />
    ),
    pen: (
      <path d="M11.6667 26.25H26.8333M4.08333 18.6667L21 1.75C22.3924 1.75 23.7277 2.30312 24.7123 3.28769C25.6969 4.27226 26.25 5.60761 26.25 7L9.33333 23.9167H8.16667C5.86367 23.9167 4.22683 24.598 2.31 25.8767L1.75 26.25L2.12333 25.69C3.40317 23.772 4.08333 22.1352 4.08333 19.8333V18.6667Z" />
    ),
    chat: (
      <path d="M6.99992 9.91659H20.9999M6.99992 15.1666H13.9999M27.4166 2.33325H26.8333C23.3333 2.91659 17.4999 3.20825 13.9999 3.20825C10.4999 3.20825 4.66659 2.91659 1.16659 2.33325H0.583252V27.4166H0.874919L1.05459 27.2369C2.7546 25.5369 4.7728 24.1884 6.99397 23.2684C9.21513 22.3484 11.5958 21.8749 13.9999 21.8749C17.4999 21.8749 23.3333 22.1666 26.8333 22.7499H27.4166V2.33325Z" />
    ),
    bank: (
      <path d="M25.0833 10.4999V22.1666M6.41667 10.4999V22.1666M2.91667 10.4999V22.1666M21.5833 10.4999V22.1666M2.33333 24.4999H25.6667M0 27.4166H28M14 12.8333H12.8333C12.5239 12.8333 12.2272 12.9562 12.0084 13.175C11.7896 13.3938 11.6667 13.6905 11.6667 13.9999V14.4374C11.6667 14.6899 11.7485 14.9355 11.9 15.1374C12.0515 15.3394 12.2643 15.4867 12.5067 15.5574L15.4933 16.4289C15.7357 16.4996 15.9485 16.647 16.1 16.8489C16.2515 17.0509 16.3333 17.2965 16.3333 17.5489V18.6666C16.3333 18.976 16.2104 19.2728 15.9916 19.4915C15.7728 19.7103 15.4761 19.8333 15.1667 19.8333H14M14 12.8333H15.1667C15.4761 12.8333 15.7728 12.9562 15.9916 13.175C16.2104 13.3938 16.3333 13.6905 16.3333 13.9999V14.5833M14 12.8333V10.4999M14 19.8333H12.8333C12.5239 19.8333 12.2272 19.7103 12.0084 19.4915C11.7896 19.2728 11.6667 18.976 11.6667 18.6666V18.0833M14 19.8333V22.1666M27.4167 7.29159V8.16659H0.583333V7.29159C6.41667 5.24992 9.91667 3.49992 13.7083 0.583252H14.2917C18.0833 3.49992 21.5833 5.24992 27.4167 7.29159Z" />
    ),
    newspapers: (
      <path d="M22.0617 23.3333C22.3837 21.2065 22.75 17.9235 22.75 14C22.75 7 21.5833 2.04167 21.5833 2.04167L21.525 1.75H1.75V2.04167C1.75 2.04167 2.91667 7 2.91667 14C2.91667 21 1.75 25.9583 1.75 25.9583V26.25H25.025L25.0833 25.9583C25.0833 25.9583 26.25 21 26.25 14C26.25 10.4183 25.9443 7.37217 25.6468 5.25H22.1667M19.0342 19.25H6.20083M5.8135 5.25C6.29621 8.728 6.48976 12.24 6.39217 15.75H19.2255C19.3231 12.24 19.1296 8.72799 18.6468 5.25H5.8135Z" />
    ),
    office: (
      <path d="M28 7.58336C27.6162 7.58336 27.2312 7.66503 26.9068 7.86919C25.0833 9.02186 25.0833 10.5934 25.0833 11.6667V12.25H19.8333M10.5 15.75H28M19.25 15.75V28M14 27.4167C12.8333 27.4167 11.9583 25.6667 11.9583 25.6667C11.0833 23.9167 11.0833 22.75 11.0833 21V19.25H1.75V18.9584L3.99233 10.2142C4.18528 9.46157 4.62317 8.79454 5.237 8.31822C5.85083 7.8419 6.6057 7.58337 7.38267 7.58336H8.75L10.4382 10.9597C10.632 11.3476 10.9301 11.6738 11.2989 11.9017C11.6678 12.1296 12.0929 12.2502 12.5265 12.25H17.5M8.575 5.25003C8.575 5.25003 6.70833 4.08336 6.70833 2.62503C6.70833 2.35722 6.76108 2.09203 6.86357 1.84461C6.96605 1.59718 7.11627 1.37237 7.30564 1.183C7.49501 0.993631 7.71982 0.843414 7.96725 0.740928C8.21467 0.638442 8.47986 0.585693 8.74767 0.585693C9.01548 0.585693 9.28066 0.638442 9.52808 0.740928C9.77551 0.843414 10.0003 0.993631 10.1897 1.183C10.3791 1.37237 10.5293 1.59718 10.6318 1.84461C10.7343 2.09203 10.787 2.35722 10.787 2.62503C10.787 4.08336 8.925 5.25003 8.925 5.25003H8.575Z" />
    ),
    paper: (
      <path d="M15.75 1.75V9.91667H23.9167M5.25 1.75V26.25H23.9167V9.33333L23.5877 9.18633C20.4205 7.77867 17.888 5.24621 16.4803 2.079L16.3333 1.75H5.25Z" />
    ),
    folder: (
      <path d="M1.75 11.6667V2.91675H7.58333L11.0833 6.41675H23.9167V9.91675M27.4167 10.2084V9.91675H5.36667L5.19167 10.2084L4.91867 10.7824C2.83247 15.1671 1.74999 19.9617 1.75 24.8174V25.0834H23.9167V24.9341C23.9166 20.0409 25.0158 15.2102 27.1332 10.7987L27.4167 10.2084Z" />
    ),
  }
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 28 28">
      {paths[name]}
    </svg>
  )
}

// Ancho tarjeta + gap
const CARD_W = 260
const GAP = 16
const STEP = CARD_W + GAP

function CategoryCard({ cat }: { cat: Category }) {
  return (
    <Link href={cat.href} className="group flex-shrink-0 w-[260px]">
      <div className="relative h-[310px] rounded-2xl border border-gray-200 bg-white p-6 flex flex-col items-center justify-between text-center overflow-hidden transition-all duration-300 ease-out group-hover:border-orange-400 group-hover:bg-gradient-to-b group-hover:from-orange-400 group-hover:to-orange-600 group-hover:shadow-xl group-hover:scale-[1.06]">
        <h3 className="text-base  text-gray-900 whitespace-pre-line leading-snug group-hover:text-white transition-colors pt-2">
          {cat.title}
        </h3>
        <span className="text-gray-500 group-hover:text-white transition-colors">
          <CategoryIcon name={cat.icon} />
        </span>
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
  const [index, setIndex] = useState(total)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const trackRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const items = [...categories, ...categories, ...categories]

  const goTo = useCallback((newIndex: number) => {
    setIsTransitioning(true)
    setIndex(newIndex)
  }, [])

  const next = useCallback(() => goTo(index + 1), [index, goTo])
  const prev = useCallback(() => goTo(index - 1), [index, goTo])

  const handleTransitionEnd = useCallback(() => {
    if (index >= total * 2) {
      setIsTransitioning(false)
      setIndex(total)
    } else if (index < total) {
      setIsTransitioning(false)
      setIndex(total * 2 - 1)
    }
  }, [index, total])

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true)
      setIndex((prev: number) => prev + 1)
    }, 5000)
    timerRef.current = timer
    return () => clearInterval(timer)
  }, [])

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

      <div className="overflow-x-clip overflow-y-visible -mx-4 px-4 py-3">
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
