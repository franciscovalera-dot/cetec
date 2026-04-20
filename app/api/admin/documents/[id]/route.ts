import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { writeClient, generateSlug } from '@/lib/sanity-admin'

async function checkAuth() {
  const cookieStore = await cookies()
  return !!cookieStore.get('admin_session')?.value
}

/** GET /api/admin/documents/[id] — Obtener un documento */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { id } = await params
    const doc = await writeClient.fetch(
      `*[_type == "document" && _id == $id][0] {
        _id, title, slug, tipoDocumento, sector, date, description, fileType,
        "file": file{asset->{_id, url, originalFilename}}
      }`,
      { id }
    )

    if (!doc) {
      return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 })
    }

    return NextResponse.json(doc)
  } catch (err) {
    console.error('Error al obtener documento:', err)
    return NextResponse.json({ error: 'Error al obtener el documento.' }, { status: 500 })
  }
}

/** PUT /api/admin/documents/[id] — Actualizar documento */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  const data = await req.json()
  const { title, tipoDocumento, sector, description, fileAssetId, fileType } = data

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patch: Record<string, any> = {}

  if (title) {
    patch.title = title
    patch.slug = { _type: 'slug', current: generateSlug(title) }
  }
  if (tipoDocumento !== undefined) patch.tipoDocumento = tipoDocumento || ''
  if (sector !== undefined) patch.sector = sector || ''
  if (description !== undefined) patch.description = description
  if (fileType !== undefined) patch.fileType = fileType

  if (fileAssetId) {
    patch.file = {
      _type: 'file',
      asset: { _type: 'reference', _ref: fileAssetId },
    }
  }

  try {
    const updated = await writeClient.patch(id).set(patch).commit()
    return NextResponse.json(updated)
  } catch (err) {
    console.error('Error al actualizar documento:', err)
    return NextResponse.json({ error: 'Error al guardar.' }, { status: 500 })
  }
}

/** DELETE /api/admin/documents/[id] — Eliminar documento */
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
    console.error('Error al eliminar documento:', err)
    return NextResponse.json({ error: 'Error al eliminar.' }, { status: 500 })
  }
}
