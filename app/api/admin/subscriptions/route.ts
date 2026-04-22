import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { writeClient } from '@/lib/sanity-admin'

async function checkAuth() {
  const cookieStore = await cookies()
  return !!cookieStore.get('admin_session')?.value
}

/** GET /api/admin/subscriptions — Listar suscripciones (con filtro opcional por tipo y email) */
export async function GET(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const q = searchParams.get('q')

    const filters: string[] = ['_type == "subscription"']
    const params: Record<string, string> = {}

    if (type === 'general' || type === 'search-alert') {
      filters.push('type == $type')
      params.type = type
    }
    if (q) {
      filters.push('(email match $q || query match $q)')
      params.q = `${q}*`
    }

    const query = `*[${filters.join(' && ')}] | order(createdAt desc) [0...500] {
      _id, email, type, query, seccion, tematica, sector, idioma, createdAt
    }`

    const subs = await writeClient.fetch(query, params)
    return NextResponse.json(subs)
  } catch (err) {
    console.error('Error al listar suscripciones:', err)
    return NextResponse.json(
      { error: 'Error al obtener suscripciones. Verifica SANITY_API_WRITE_TOKEN.' },
      { status: 500 }
    )
  }
}
