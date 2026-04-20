import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { writeClient, generateSlug } from '@/lib/sanity-admin'

async function checkAuth() {
  const cookieStore = await cookies()
  return !!cookieStore.get('admin_session')?.value
}

/** GET /api/admin/documents — Listar documentos con filtros opcionales */
export async function GET(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const tipoDocumento = searchParams.get('tipoDocumento')
    const sector = searchParams.get('sector')
    const busqueda = searchParams.get('q')

    const filters: string[] = ['_type == "document"']
    const params: Record<string, string> = {}

    if (tipoDocumento) {
      filters.push('tipoDocumento == $tipoDocumento')
      params.tipoDocumento = tipoDocumento
    }
    if (sector) {
      filters.push('sector == $sector')
      params.sector = sector
    }
    if (busqueda) {
      filters.push('(title match $busqueda || description match $busqueda)')
      params.busqueda = `${busqueda}*`
    }

    const query = `*[${filters.join(' && ')}] | order(date desc) [0...100] {
      _id, title, slug, tipoDocumento, sector, date, description, fileType,
      "file": file{asset->{url, originalFilename}}
    }`

    const documents = await writeClient.fetch(query, params)
    return NextResponse.json(documents)
  } catch (err) {
    console.error('Error al listar documentos:', err)
    return NextResponse.json(
      { error: 'Error al obtener documentos.' },
      { status: 500 }
    )
  }
}

/** POST /api/admin/documents — Crear nuevo documento */
export async function POST(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const data = await req.json()
  const { title, tipoDocumento, sector, description, fileAssetId, fileType } = data

  if (!title) {
    return NextResponse.json(
      { error: 'El título es obligatorio' },
      { status: 400 }
    )
  }

  const slug = generateSlug(title)

  const doc = {
    _type: 'document' as const,
    title,
    slug: { _type: 'slug' as const, current: slug },
    date: new Date().toISOString(),
    tipoDocumento: tipoDocumento || undefined,
    sector: sector || undefined,
    description: description || undefined,
    fileType: fileType || undefined,
    file: fileAssetId
      ? { _type: 'file' as const, asset: { _type: 'reference' as const, _ref: fileAssetId } }
      : undefined,
  }

  try {
    const created = await writeClient.create(doc)
    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('Error al crear documento:', err)
    return NextResponse.json(
      { error: 'Error al guardar el documento.' },
      { status: 500 }
    )
  }
}
