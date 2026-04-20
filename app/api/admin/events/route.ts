import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { writeClient, generateSlug } from '@/lib/sanity-admin'
import { htmlToPortableText } from '@/lib/portable-text-html'

async function checkAuth() {
  const cookieStore = await cookies()
  return !!cookieStore.get('admin_session')?.value
}

/** GET /api/admin/events — Listar eventos */
export async function GET(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const busqueda = searchParams.get('q')
    const periodo = searchParams.get('periodo') // 'proximos' | 'pasados' | ''

    const filters: string[] = ['_type == "agenda"']
    const params: Record<string, string> = {}

    if (busqueda) {
      filters.push('(title match $busqueda || location match $busqueda)')
      params.busqueda = `${busqueda}*`
    }
    if (periodo === 'proximos') {
      filters.push('date >= now()')
    } else if (periodo === 'pasados') {
      filters.push('date < now()')
    }

    const query = `*[${filters.join(' && ')}] | order(date desc) [0...100] {
      _id, title, slug, date, endDate, location, image, link
    }`

    const events = await writeClient.fetch(query, params)
    return NextResponse.json(events)
  } catch (err) {
    console.error('Error al listar eventos:', err)
    return NextResponse.json({ error: 'Error al obtener eventos.' }, { status: 500 })
  }
}

/** POST /api/admin/events — Crear nuevo evento */
export async function POST(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const data = await req.json()
  const { title, date, endDate, location, description, link, imageAssetId } = data

  if (!title || !date) {
    return NextResponse.json(
      { error: 'Título y fecha son obligatorios' },
      { status: 400 }
    )
  }

  const slug = generateSlug(title)

  const doc = {
    _type: 'agenda' as const,
    title,
    slug: { _type: 'slug' as const, current: slug },
    date,
    endDate: endDate || undefined,
    location: location || undefined,
    description: description ? htmlToPortableText(description) : undefined,
    link: link || undefined,
    image: imageAssetId
      ? { _type: 'image' as const, asset: { _type: 'reference' as const, _ref: imageAssetId } }
      : undefined,
  }

  try {
    const created = await writeClient.create(doc)
    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('Error al crear evento:', err)
    return NextResponse.json({ error: 'Error al guardar el evento.' }, { status: 500 })
  }
}
