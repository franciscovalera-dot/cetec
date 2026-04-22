import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity-admin'
import { checkAuth } from '@/lib/admin-auth'

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
      // Sanear wildcards GROQ: * y ? son tokens especiales en `match`.
      // Eliminar también whitespace y backslashes para evitar patrones
      // no intencionados que podrían exfiltrar datos arbitrarios.
      const safeQ = String(q).replace(/[*?\\\s]/g, '').slice(0, 100)
      if (safeQ) {
        filters.push('(email match $q || query match $q)')
        params.q = `${safeQ}*`
      }
    }

    const query = `*[${filters.join(' && ')}] | order(createdAt desc) [0...500] {
      _id, email, type, query, seccion, tematica, sector, idioma, createdAt
    }`

    const subs = await writeClient.fetch(query, params)
    return NextResponse.json(subs)
  } catch (err) {
    console.error('Error al listar suscripciones:', err)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
