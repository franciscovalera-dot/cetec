import { NextRequest, NextResponse } from 'next/server'
import { writeClient, generateSlug } from '@/lib/sanity-admin'
import { htmlToPortableText } from '@/lib/portable-text-html'
import { checkAuth } from '@/lib/admin-auth'

/** GET /api/admin/glossary/[id] — Obtener un término */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { id } = await params
    const term = await writeClient.fetch(
      `*[_type == "glossary" && _id == $id][0] {
        _id, term, slug, definition, tematica, sector,
        "category": category->{name},
        "relatedTerms": relatedTerms[]->{_id, term, slug}
      }`,
      { id }
    )

    if (!term) {
      return NextResponse.json({ error: 'Término no encontrado' }, { status: 404 })
    }

    return NextResponse.json(term)
  } catch (err) {
    console.error('Error al obtener término:', err)
    return NextResponse.json({ error: 'Error al obtener el término.' }, { status: 500 })
  }
}

/** PUT /api/admin/glossary/[id] — Actualizar término */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  const data = await req.json()
  const { term, definition, tematica, sector } = data

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patch: Record<string, any> = {}

  if (term) {
    patch.term = term
    patch.slug = { _type: 'slug', current: generateSlug(term) }
  }
  if (definition !== undefined) patch.definition = htmlToPortableText(definition)
  if (tematica !== undefined) patch.tematica = tematica || ''
  if (sector !== undefined) patch.sector = sector || ''

  try {
    const updated = await writeClient.patch(id).set(patch).commit()
    return NextResponse.json(updated)
  } catch (err) {
    console.error('Error al actualizar término:', err)
    return NextResponse.json({ error: 'Error al guardar.' }, { status: 500 })
  }
}

/** DELETE /api/admin/glossary/[id] — Eliminar término */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { id } = await params
    await writeClient.delete(id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Error al eliminar término:', err)
    return NextResponse.json({ error: 'Error al eliminar.' }, { status: 500 })
  }
}
