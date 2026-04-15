import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { writeClient, generateSlug, textToPortableText } from '@/lib/sanity-admin'

/** Verifica que la sesión de admin es válida */
async function checkAuth() {
  const cookieStore = await cookies()
  return !!cookieStore.get('admin_session')?.value
}

/** GET /api/admin/posts — Listar entradas con filtros opcionales */
export async function GET(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const seccion = searchParams.get('seccion')
    const tematica = searchParams.get('tematica')
    const sector = searchParams.get('sector')
    const busqueda = searchParams.get('q')

    // Construir filtro GROQ dinámicamente
    const filters: string[] = ['_type == "post"']
    const params: Record<string, string> = {}

    if (seccion) {
      filters.push('seccion == $seccion')
      params.seccion = seccion
    }
    if (tematica) {
      filters.push('tematica == $tematica')
      params.tematica = tematica
    }
    if (sector) {
      filters.push('sector == $sector')
      params.sector = sector
    }
    if (busqueda) {
      filters.push('(title match $busqueda || excerpt match $busqueda)')
      params.busqueda = `${busqueda}*`
    }

    const query = `*[${filters.join(' && ')}] | order(publishedAt desc) [0...100] {
      _id, title, slug, seccion, tematica, sector, publishedAt, excerpt, image,
      "author": author->{name}
    }`

    const posts = await writeClient.fetch(query, params)
    return NextResponse.json(posts)
  } catch (err) {
    console.error('Error al listar posts:', err)
    return NextResponse.json(
      { error: 'Error al obtener entradas. Verifica SANITY_API_WRITE_TOKEN.' },
      { status: 500 }
    )
  }
}

/** POST /api/admin/posts — Crear nueva entrada */
export async function POST(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const data = await req.json()
  const {
    title,
    seccion,
    tematica,
    sector,
    excerpt,
    body,
    tags,
    imageAssetId,
    imageAlt,
  } = data

  if (!title || !seccion) {
    return NextResponse.json(
      { error: 'Título y sección son obligatorios' },
      { status: 400 }
    )
  }

  const slug = generateSlug(title)

  const doc = {
    _type: 'post' as const,
    title,
    slug: { _type: 'slug' as const, current: slug },
    seccion,
    publishedAt: new Date().toISOString(),
    tematica: tematica || undefined,
    sector: sector || undefined,
    excerpt: excerpt || undefined,
    body: body ? textToPortableText(body) : undefined,
    tags: tags ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : undefined,
    image: imageAssetId
      ? {
          _type: 'image' as const,
          alt: imageAlt || '',
          asset: { _type: 'reference' as const, _ref: imageAssetId },
        }
      : undefined,
  }

  try {
    const created = await writeClient.create(doc)
    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('Error al crear post:', err)
    return NextResponse.json(
      { error: 'Error al guardar. Verifica que SANITY_API_WRITE_TOKEN esté configurado en .env.local' },
      { status: 500 }
    )
  }
}
