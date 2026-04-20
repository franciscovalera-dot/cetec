import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { writeClient, generateSlug } from '@/lib/sanity-admin'
import { htmlToPortableText } from '@/lib/portable-text-html'

async function checkAuth() {
  const cookieStore = await cookies()
  return !!cookieStore.get('admin_session')?.value
}

/** GET /api/admin/glossary — Listar términos del glosario */
export async function GET(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const tematica = searchParams.get('tematica')
    const sector = searchParams.get('sector')
    const busqueda = searchParams.get('q')

    const filters: string[] = ['_type == "glossary"']
    const params: Record<string, string> = {}

    if (tematica) {
      filters.push('tematica == $tematica')
      params.tematica = tematica
    }
    if (sector) {
      filters.push('sector == $sector')
      params.sector = sector
    }
    if (busqueda) {
      filters.push('term match $busqueda')
      params.busqueda = `${busqueda}*`
    }

    const query = `*[${filters.join(' && ')}] | order(term asc) [0...200] {
      _id, term, slug, tematica, sector,
      "category": category->{name}
    }`

    const terms = await writeClient.fetch(query, params)
    return NextResponse.json(terms)
  } catch (err) {
    console.error('Error al listar glosario:', err)
    return NextResponse.json({ error: 'Error al obtener términos.' }, { status: 500 })
  }
}

/** POST /api/admin/glossary — Crear nuevo término */
export async function POST(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const data = await req.json()
  const { term, definition, tematica, sector } = data

  if (!term || !definition) {
    return NextResponse.json(
      { error: 'Término y definición son obligatorios' },
      { status: 400 }
    )
  }

  const slug = generateSlug(term)

  const doc = {
    _type: 'glossary' as const,
    term,
    slug: { _type: 'slug' as const, current: slug },
    definition: htmlToPortableText(definition),
    tematica: tematica || undefined,
    sector: sector || undefined,
  }

  try {
    const created = await writeClient.create(doc)
    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('Error al crear término:', err)
    return NextResponse.json({ error: 'Error al guardar el término.' }, { status: 500 })
  }
}
