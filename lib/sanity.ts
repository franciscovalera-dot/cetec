/**
 * Cliente de Sanity y queries GROQ centralizadas
 * Todas las consultas a la API de Sanity pasan por este módulo
 */
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
// Tipo para fuentes de imagen de Sanity
type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>['image']>[0]

// ─── CLIENTE SANITY ──────────────────────────────────────────────
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'tu-project-id'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Usar CDN en producción para mejor rendimiento
  useCdn: process.env.NODE_ENV === 'production',
})

// ─── GENERADOR DE URLs DE IMAGEN ─────────────────────────────────
const builder = imageUrlBuilder(client)

/**
 * Genera URL optimizada para imágenes de Sanity
 * Uso: urlFor(post.image).width(800).url()
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// ─── TIPOS TYPESCRIPT ────────────────────────────────────────────
export interface Post {
  _id: string
  title: string
  slug: { current: string }
  seccion?: string
  tematica?: string
  sector?: string
  idioma?: string
  category?: {
    name: string
    slug: { current: string }
    color: string
  }
  author?: {
    name: string
    image?: SanityImageSource
    bio?: string
  }
  publishedAt: string
  image?: SanityImageSource & { alt?: string }
  excerpt?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any[]
  tags?: string[]
  tecnologias?: string[]
  descriptores?: string[]
}

export interface Category {
  _id: string
  name: string
  slug: { current: string }
  description?: string
  color: string
}

export interface AgendaEvent {
  _id: string
  title: string
  slug: { current: string }
  date: string
  endDate?: string
  location?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description?: any[]
  image?: SanityImageSource
  link?: string
}

export interface Document {
  _id: string
  title: string
  slug: { current: string }
  file: { asset: { url: string } }
  category?: { name: string; slug: { current: string } }
  date?: string
  description?: string
  fileType?: string
}

export interface GlossaryTerm {
  _id: string
  term: string
  slug: { current: string }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  definition: any[]
  tematica?: string
  sector?: string
  category?: { name: string }
  relatedTerms?: { term: string; slug: { current: string } }[]
}

// ─── QUERIES GROQ ────────────────────────────────────────────────

// Campos comunes expandidos para posts
const postFields = `
  _id,
  title,
  slug,
  seccion,
  tematica,
  sector,
  idioma,
  publishedAt,
  excerpt,
  image,
  tags,
  tecnologias,
  descriptores,
  "category": category->{name, slug, color},
  "author": author->{name, image, bio}
`

/** Obtener los últimos N posts para la página de inicio */
export async function getLatestPosts(limit = 6): Promise<Post[]> {
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc) [0...$limit] {
      ${postFields}
    }`,
    { limit },
    { next: { revalidate: 60 } } // ISR: revalidar cada 60 segundos
  )
}

/** Obtener todos los posts de una categoría */
export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  return client.fetch(
    `*[_type == "post" && category->slug.current == $categorySlug] | order(publishedAt desc) {
      ${postFields}
    }`,
    { categorySlug },
    { next: { revalidate: 60 } }
  )
}

/** Obtener posts por sección (noticias, normativa, formacion, etc.) */
export async function getPostsBySeccion(
  seccion: string,
  filters?: { tematica?: string; sector?: string }
): Promise<Post[]> {
  const conditions = ['_type == "post"', 'seccion == $seccion']
  const params: Record<string, string> = { seccion }

  if (filters?.tematica) {
    conditions.push('tematica == $tematica')
    params.tematica = filters.tematica
  }
  if (filters?.sector) {
    conditions.push('sector == $sector')
    params.sector = filters.sector
  }

  return client.fetch(
    `*[${conditions.join(' && ')}] | order(publishedAt desc) {
      ${postFields}
    }`,
    params,
    { next: { revalidate: 60 } }
  )
}

/** Obtener un post individual por su slug */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      ${postFields},
      body
    }`,
    { slug },
    { next: { revalidate: 60 } }
  )
}

/** Obtener todas las categorías */
export async function getCategories(): Promise<Category[]> {
  return client.fetch(
    `*[_type == "category"] | order(name asc) {
      _id, name, slug, description, color
    }`,
    {},
    { next: { revalidate: 60 } }
  )
}

/** Obtener todos los eventos de la agenda (futuros primero, luego pasados) */
export async function getAllEvents(): Promise<AgendaEvent[]> {
  return client.fetch(
    `*[_type == "agenda"] | order(date desc) {
      _id, title, slug, date, endDate, location, image, link, description
    }`,
    {},
    { next: { revalidate: 60 } }
  )
}

/** Obtener próximos eventos de la agenda */
export async function getUpcomingEvents(limit = 10): Promise<AgendaEvent[]> {
  return client.fetch(
    `*[_type == "agenda" && date >= now()] | order(date asc) [0...$limit] {
      _id, title, slug, date, endDate, location, image, link
    }`,
    { limit },
    { next: { revalidate: 60 } }
  )
}

/** Obtener documentos con filtro opcional por categoría */
export async function getDocuments(categorySlug?: string): Promise<Document[]> {
  const filter = categorySlug
    ? `&& category->slug.current == $categorySlug`
    : ''
  return client.fetch(
    `*[_type == "document" ${filter}] | order(date desc) {
      _id, title, slug, description, fileType, date, tipoDocumento, sector,
      "file": file{asset->{url}},
      "category": category->{name, slug}
    }`,
    categorySlug ? { categorySlug } : {},
    { next: { revalidate: 60 } }
  )
}

/** Obtener todos los términos del glosario */
export async function getGlossaryTerms(): Promise<GlossaryTerm[]> {
  return client.fetch(
    `*[_type == "glossary"] | order(term asc) {
      _id, term, slug, definition, tematica, sector,
      "category": category->{name},
      "relatedTerms": relatedTerms[]->{term, slug}
    }`,
    {},
    { next: { revalidate: 60 } }
  )
}

/**
 * Búsqueda global por texto en múltiples tipos de contenido
 * Busca en posts, agenda, documentos y glosario
 */
export async function searchContent(searchTerm: string): Promise<{
  posts: Post[]
  events: AgendaEvent[]
  documents: Document[]
  glossary: GlossaryTerm[]
}> {
  const term = `${searchTerm}*`
  // Buscar en paralelo en todos los tipos de contenido
  const [posts, events, documents, glossary] = await Promise.all([
    client.fetch(
      `*[_type == "post" && (
        title match $term ||
        excerpt match $term ||
        pt::text(body) match $term ||
        $term in tags
      )] | order(publishedAt desc) [0...20] {
        ${postFields}
      }`,
      { term },
      { next: { revalidate: 60 } }
    ),
    client.fetch(
      `*[_type == "agenda" && (
        title match $term ||
        location match $term
      )] | order(date desc) [0...10] {
        _id, title, slug, date, location, image
      }`,
      { term },
      { next: { revalidate: 60 } }
    ),
    client.fetch(
      `*[_type == "document" && (
        title match $term ||
        description match $term
      )] | order(date desc) [0...10] {
        _id, title, slug, description, fileType, date,
        "file": file{asset->{url}},
        "category": category->{name, slug}
      }`,
      { term },
      { next: { revalidate: 60 } }
    ),
    client.fetch(
      `*[_type == "glossary" && (
        term match $term
      )] | order(term asc) [0...10] {
        _id, term, slug, definition,
        "category": category->{name}
      }`,
      { term },
      { next: { revalidate: 60 } }
    ),
  ])

  return { posts, events, documents, glossary }
}

/** Obtener todo el contenido ordenado por fecha descendente (página de búsqueda sin query) */
export async function getAllContent(): Promise<{
  posts: Post[]
  events: AgendaEvent[]
  documents: Document[]
  glossary: GlossaryTerm[]
}> {
  const [posts, events, documents, glossary] = await Promise.all([
    client.fetch(
      `*[_type == "post"] | order(publishedAt desc) { ${postFields} }`,
      {},
      { next: { revalidate: 60 } }
    ),
    client.fetch(
      `*[_type == "agenda"] | order(date desc) { _id, title, slug, date, location }`,
      {},
      { next: { revalidate: 60 } }
    ),
    client.fetch(
      `*[_type == "document"] | order(date desc) { _id, title, slug, description, fileType, date, "file": file{asset->{url}} }`,
      {},
      { next: { revalidate: 60 } }
    ),
    client.fetch(
      `*[_type == "glossary"] | order(term asc) { _id, term, slug, definition, tematica, sector, "category": category->{name} }`,
      {},
      { next: { revalidate: 60 } }
    ),
  ])
  return { posts, events, documents, glossary }
}

/** Obtener todos los slugs de posts (para generateStaticParams) */
export async function getAllPostSlugs(): Promise<
  { category: string; slug: string }[]
> {
  return client.fetch(
    `*[_type == "post" && defined(slug.current)] {
      "slug": slug.current,
      "category": coalesce(category->slug.current, seccion)
    }`,
    {},
    { next: { revalidate: 60 } }
  )
}

/** Posts relacionados (misma categoría, excluyendo el actual) */
export async function getRelatedPosts(
  categorySlug: string,
  currentSlug: string,
  limit = 3
): Promise<Post[]> {
  return client.fetch(
    `*[_type == "post" && category->slug.current == $categorySlug && slug.current != $currentSlug] | order(publishedAt desc) [0...$limit] {
      ${postFields}
    }`,
    { categorySlug, currentSlug, limit },
    { next: { revalidate: 60 } }
  )
}
