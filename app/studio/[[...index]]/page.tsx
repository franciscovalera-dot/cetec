/**
 * Página que monta Sanity Studio como SPA dentro de Next.js
 * Accesible en /studio
 */
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
