import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { writeClient, generateSlug } from '@/lib/sanity-admin'
import { htmlToPortableText } from '@/lib/portable-text-html'

async function checkAuth() {
  const cookieStore = await cookies()
  return !!cookieStore.get('admin_session')?.value
}

/** GET /api/admin/events/[id] — Obtener un evento */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { id } = await params
    const event = await writeClient.fetch(
      `*[_type == "agenda" && _id == $id][0] {
        _id, title, slug, date, endDate, location, description, image, link
      }`,
      { id }
    )

    if (!event) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (err) {
    console.error('Error al obtener evento:', err)
    return NextResponse.json({ error: 'Error al obtener el evento.' }, { status: 500 })
  }
}

/** PUT /api/admin/events/[id] — Actualizar evento */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  const data = await req.json()
  const { title, date, endDate, location, description, link, imageAssetId } = data

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patch: Record<string, any> = {}

  if (title) {
    patch.title = title
    patch.slug = { _type: 'slug', current: generateSlug(title) }
  }
  if (date) patch.date = date
  if (endDate !== undefined) patch.endDate = endDate || ''
  if (location !== undefined) patch.location = location
  if (description !== undefined) patch.description = htmlToPortableText(description)
  if (link !== undefined) patch.link = link

  if (imageAssetId) {
    patch.image = {
      _type: 'image',
      asset: { _type: 'reference', _ref: imageAssetId },
    }
  }

  try {
    const updated = await writeClient.patch(id).set(patch).commit()
    return NextResponse.json(updated)
  } catch (err) {
    console.error('Error al actualizar evento:', err)
    return NextResponse.json({ error: 'Error al guardar.' }, { status: 500 })
  }
}

/** DELETE /api/admin/events/[id] — Eliminar evento */
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
    console.error('Error al eliminar evento:', err)
    return NextResponse.json({ error: 'Error al eliminar.' }, { status: 500 })
  }
}
