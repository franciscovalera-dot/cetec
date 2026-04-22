import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity-admin'
import { verifyRecaptcha } from '@/lib/recaptcha'

// Límites por campo para evitar que un atacante llene la base con payloads enormes.
const MAX_EMAIL_LEN = 254
const MAX_FILTER_VALUE_LEN = 120
const MAX_QUERY_LEN = 200
// Email regex estricto (RFC-like, no permite espacios ni saltos de línea)
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

function trimTo(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined
  const v = value.trim()
  if (!v) return undefined
  return v.slice(0, max)
}

/** POST /api/subscriptions — Alta pública de suscripción (general o alerta de búsqueda) */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { email, type, query, seccion, tematica, sector, idioma, captchaToken } = data

    if (!(await verifyRecaptcha(captchaToken, req))) {
      return NextResponse.json({ error: 'Verificación anti-bot fallida' }, { status: 400 })
    }

    if (
      !email ||
      typeof email !== 'string' ||
      email.length > MAX_EMAIL_LEN ||
      !EMAIL_RE.test(email)
    ) {
      return NextResponse.json({ error: 'Email no válido' }, { status: 400 })
    }
    if (type !== 'general' && type !== 'search-alert') {
      return NextResponse.json({ error: 'Tipo no válido' }, { status: 400 })
    }

    const isAlert = type === 'search-alert'
    const normalizedEmail = email.trim().toLowerCase()

    // Check duplicado: misma email + mismo tipo (para alertas, también mismos filtros).
    // Si ya existe, devolver 200 silenciosamente — no filtramos si un email está
    // ya suscrito (evita enumeración) pero tampoco creamos duplicados.
    const existing = await writeClient.fetch<string | null>(
      '*[_type == "subscription" && email == $email && type == $type][0]._id',
      { email: normalizedEmail, type }
    )
    if (existing) {
      return NextResponse.json({ ok: true, duplicated: true }, { status: 200 })
    }

    const doc = {
      _type: 'subscription' as const,
      email: normalizedEmail,
      type,
      query:    isAlert ? trimTo(query,    MAX_QUERY_LEN)       : undefined,
      seccion:  isAlert ? trimTo(seccion,  MAX_FILTER_VALUE_LEN) : undefined,
      tematica: isAlert ? trimTo(tematica, MAX_FILTER_VALUE_LEN) : undefined,
      sector:   isAlert ? trimTo(sector,   MAX_FILTER_VALUE_LEN) : undefined,
      idioma:   isAlert ? trimTo(idioma,   MAX_FILTER_VALUE_LEN) : undefined,
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
