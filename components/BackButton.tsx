'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Props {
  fallbackHref: string
  label: string
}

/**
 * Botón "Volver a X" inteligente.
 * Si el usuario llegó a esta página desde la página de listado correspondiente
 * (ej. /noticias con filtros aplicados), al pulsarlo usa router.back() para
 * preservar los filtros y la posición de scroll.
 * Si llegó directamente (Google, enlace externo, otra página), navega al URL
 * de fallback (listado sin filtros).
 */
export default function BackButton({ fallbackHref, label }: Props) {
  const router = useRouter()

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (typeof window === 'undefined' || !document.referrer) return
    try {
      const referrer = new URL(document.referrer)
      const isSameOrigin = referrer.origin === window.location.origin
      const isSameSection = referrer.pathname === fallbackHref
      if (isSameOrigin && isSameSection) {
        e.preventDefault()
        router.back()
      }
    } catch {
      // Si referrer no es parseable, dejar que Link navegue al fallback
    }
  }

  return (
    <Link
      href={fallbackHref}
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-gray-700 border border-[#DFDFDF] rounded hover:bg-gray-100 transition-colors"
      style={{ backgroundColor: '#F9F9F8' }}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Volver a {label}
    </Link>
  )
}
