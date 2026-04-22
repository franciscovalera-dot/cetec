import { NextRequest, NextResponse } from 'next/server'
import { writeClient, generateSlug } from '@/lib/sanity-admin'
import { htmlToPortableText } from '@/lib/portable-text-html'
import { checkAuth } from '@/lib/admin-auth'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  try {
    const { id } = await params
    const sol = await writeClient.fetch(
      `*[_type == "solucion" && _id == $id][0] { _id, title, slug, description, tecnologia, sector, reto, material, numero, solicitante, inventor, fuente, image, publishedAt }`,
      { id }
    )
    if (!sol) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(sol)
  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json({ error: 'Error al obtener.' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id } = await params
  const data = await req.json()
  const { title, description, tecnologia, sector, reto, material, numero, solicitante, inventor, fuente, imageAssetId } = data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patch: Record<string, any> = {}
  if (title) { patch.title = title; patch.slug = { _type: 'slug', current: generateSlug(title) } }
  if (description !== undefined) patch.description = description ? htmlToPortableText(description) : []
  if (tecnologia !== undefined) patch.tecnologia = tecnologia || ''
  if (sector !== undefined) patch.sector = sector || ''
  if (reto !== undefined) patch.reto = reto || ''
  if (material !== undefined) patch.material = material || ''
  if (numero !== undefined) patch.numero = numero || ''
  if (solicitante !== undefined) patch.solicitante = solicitante || ''
  if (inventor !== undefined) patch.inventor = inventor || ''
  if (fuente !== undefined) patch.fuente = fuente || ''
  if (imageAssetId) patch.image = { _type: 'image', asset: { _type: 'reference', _ref: imageAssetId } }
  try {
    const updated = await writeClient.patch(id).set(patch).commit()
    return NextResponse.json(updated)
  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json({ error: 'Error al guardar.' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  try {
    const { id } = await params
    await writeClient.delete(id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json({ error: 'Error al eliminar.' }, { status: 500 })
  }
}
