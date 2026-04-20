import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { writeClient, generateSlug } from '@/lib/sanity-admin'
import { htmlToPortableText } from '@/lib/portable-text-html'

async function checkAuth() {
  const cookieStore = await cookies()
  return !!cookieStore.get('admin_session')?.value
}

/** GET /api/admin/posts/[id] — Obtener una entrada */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { id } = await params
    const post = await writeClient.fetch(
      `*[_type == "post" && _id == $id][0] {
        _id, title, slug, seccion, tematica, sector, publishedAt, excerpt, body, tags, tecnologias, descriptores, image,
        "author": author->{_id, name}
      }`,
      { id }
    )

    if (!post) {
      return NextResponse.json({ error: 'Entrada no encontrada' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (err) {
    console.error('Error al obtener post:', err)
    return NextResponse.json(
      { error: 'Error al obtener la entrada. Verifica SANITY_API_WRITE_TOKEN.' },
      { status: 500 }
    )
  }
}

/** PUT /api/admin/posts/[id] — Actualizar entrada */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  const data = await req.json()
  const {
    title,
    seccion,
    tematica,
    sector,
    excerpt,
    body,
    tags,
    tecnologias,
    descriptores,
    imageAssetId,
    imageAlt,
  } = data

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patch: Record<string, any> = {}

  const parseTags = (v: string) => v.split(',').map((t: string) => t.trim()).filter(Boolean)

  if (title) {
    patch.title = title
    patch.slug = { _type: 'slug', current: generateSlug(title) }
  }
  if (seccion) patch.seccion = seccion
  if (tematica !== undefined) patch.tematica = tematica || ''
  if (sector !== undefined) patch.sector = sector || ''
  if (excerpt !== undefined) patch.excerpt = excerpt
  if (body !== undefined) patch.body = htmlToPortableText(body)
  if (tags !== undefined) {
    patch.tags = typeof tags === 'string' ? parseTags(tags) : tags
  }
  if (tecnologias !== undefined) {
    patch.tecnologias = typeof tecnologias === 'string' ? parseTags(tecnologias) : tecnologias
  }
  if (descriptores !== undefined) {
    patch.descriptores = typeof descriptores === 'string' ? parseTags(descriptores) : descriptores
  }

  if (imageAssetId) {
    patch.image = {
      _type: 'image',
      alt: imageAlt || '',
      asset: { _type: 'reference', _ref: imageAssetId },
    }
  }

  try {
    const updated = await writeClient
      .patch(id)
      .set(patch)
      .commit()

    return NextResponse.json(updated)
  } catch (err) {
    console.error('Error al actualizar post:', err)
    return NextResponse.json(
      { error: 'Error al guardar. Verifica SANITY_API_WRITE_TOKEN.' },
      { status: 500 }
    )
  }
}

/** DELETE /api/admin/posts/[id] — Eliminar entrada */
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
    console.error('Error al eliminar post:', err)
    return NextResponse.json(
      { error: 'Error al eliminar. Verifica SANITY_API_WRITE_TOKEN.' },
      { status: 500 }
    )
  }
}
