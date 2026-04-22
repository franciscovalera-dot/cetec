import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity-admin'

/** POST /api/subscriptions — Alta pública de suscripción (general o alerta de búsqueda) */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { email, type, query, seccion, tematica, sector, idioma } = data

    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Email no válido' }, { status: 400 })
    }
    if (type !== 'general' && type !== 'search-alert') {
      return NextResponse.json({ error: 'Tipo no válido' }, { status: 400 })
    }

    const isAlert = type === 'search-alert'

    const doc = {
      _type: 'subscription' as const,
      email: email.trim().toLowerCase(),
      type,
      query:    isAlert && query    ? String(query).trim()    : undefined,
      seccion:  isAlert && seccion  ? String(seccion).trim()  : undefined,
      tematica: isAlert && tematica ? String(tematica).trim() : undefined,
      sector:   isAlert && sector   ? String(sector).trim()   : undefined,
      idioma:   isAlert && idioma   ? String(idioma).trim()   : undefined,
      createdAt: new Date().toISOString(),
    }

    const created = await writeClient.create(doc)
    return NextResponse.json({ ok: true, id: created._id }, { status: 201 })
  } catch (err) {
    console.error('Error al crear suscripción:', err)
    return NextResponse.json(
      { error: 'Error al suscribirse. Inténtalo de nuevo.' },
      { status: 500 }
    )
  }
}
