/**
 * Cliente Sanity con permisos de escritura para el panel de administración.
 * Requiere SANITY_API_WRITE_TOKEN en las variables de entorno.
 */
import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
const token = process.env.SANITY_API_WRITE_TOKEN || ''

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

// ─── CONSTANTES DE CATEGORIZACIÓN ────────────────────────────────

export const SECCIONES = [
  { value: 'noticias', label: 'Noticias' },
  { value: 'normativa', label: 'Normativa y Legislación' },
  { value: 'formacion', label: 'Formación y Cursos' },
  { value: 'ayudas', label: 'Ayudas y Subvenciones' },
  { value: 'agenda', label: 'Agenda / Eventos' },
  { value: 'markettech', label: 'MarketTech' },
] as const

export const TEMATICAS = [
  { value: 'materiales', label: 'Materiales' },
  { value: 'procesos', label: 'Procesos' },
  { value: 'digitalizacion', label: 'Digitalización' },
  { value: 'reciclado', label: 'Reciclado' },
  { value: 'ecodiseno', label: 'Ecodiseño' },
] as const

export const SECTORES = [
  { value: 'plastico', label: 'Plástico' },
  { value: 'calzado', label: 'Calzado' },
  { value: 'agroalimentario', label: 'Agroalimentario' },
] as const

export const TIPOS_DOCUMENTO = [
  { value: 'articulo-tecnico', label: 'Artículo técnico' },
  { value: 'boletin-vigilancia', label: 'Boletín de vigilancia' },
  { value: 'guia-buenas-practicas', label: 'Guía de buenas prácticas' },
  { value: 'informe-estado-arte', label: 'Informe de Estado del Arte' },
] as const

// ─── HELPERS ─────────────────────────────────────────────────────

/** Genera slug a partir de un string */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 96)
}

/** Convierte texto plano con saltos de línea a bloques Portable Text */
export function textToPortableText(text: string) {
  if (!text) return []
  return text
    .split(/\n\n+/)
    .filter(Boolean)
    .map((paragraph) => ({
      _type: 'block',
      _key: Math.random().toString(36).slice(2, 10),
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: Math.random().toString(36).slice(2, 10),
          text: paragraph.trim(),
          marks: [],
        },
      ],
    }))
}

/** Convierte bloques Portable Text a texto plano */
export function portableTextToPlain(blocks: unknown[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''
  return blocks
    .filter((b: unknown) => {
      const block = b as { _type?: string }
      return block._type === 'block'
    })
    .map((b: unknown) => {
      const block = b as { children?: { text?: string }[] }
      return (block.children || []).map((c) => c.text || '').join('')
    })
    .join('\n\n')
}
