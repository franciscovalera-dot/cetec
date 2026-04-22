import { NextRequest, NextResponse } from 'next/server'
import { writeClient, generateSlug } from '@/lib/sanity-admin'
import { htmlToPortableText } from '@/lib/portable-text-html'
import { checkAuth } from '@/lib/admin-auth'

/** GET /api/admin/soluciones — Listar soluciones */
export async function GET(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const busqueda = searchParams.get('q')
    const tecnologia = searchParams.get('tecnologia')
    const sector = searchParams.get('sector')

    const filters: string[] = ['_type == "solucion"']
    const params: Record<string, string> = {}

    if (busqueda) {
      filters.push('(title match $busqueda || pt::text(description) match $busqueda)')
      params.busqueda = `${busqueda}*`
    }
    if (tecnologia) { filters.push('tecnologia == $tecnologia'); params.tecnologia = tecnologia }
    if (sector) { filters.push('sector == $sector'); params.sector = sector }

    const query = `*[${filters.join(' && ')}] | order(title asc) [0...100] {
      _id, title, slug, description, tecnologia, sector, reto, material
    }`

    const soluciones = await writeClient.fetch(query, params)
    return NextResponse.json(soluciones)
  } catch (err) {
    console.error('Error al listar soluciones:', err)
    return NextResponse.json({ error: 'Error al obtener soluciones.' }, { status: 500 })
  }
}

/** POST /api/admin/soluciones — Crear nueva solución */
export async function POST(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const data = await req.json()
  const { title, description, tecnologia, sector, reto, material, numero, solicitante, inventor, fuente, imageAssetId } = data

  if (!title) {
    return NextResponse.json({ error: 'El título es obligatorio' }, { status: 400 })
  }

  const doc = {
    _type: 'solucion' as const,
    title,
    slug: { _type: 'slug' as const, current: generateSlug(title) },
    description: description ? htmlToPortableText(description) : undefined,
    publishedAt: new Date().toISOString(),
    tecnologia: tecnologia || undefined,
    sector: sector || undefined,
    reto: reto || undefined,
    material: material || undefined,
    numero: numero || undefined,
    solicitante: solicitante || undefined,
    inventor: inventor || undefined,
    fuente: fuente || undefined,
    image: imageAssetId
      ? { _type: 'image' as const, asset: { _type: 'reference' as const, _ref: imageAssetId } }
      : undefined,
  }

  try {
    const created = await writeClient.create(doc)
    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('Error al crear solución:', err)
    return NextResponse.json({ error: 'Error al guardar.' }, { status: 500 })
  }
}
