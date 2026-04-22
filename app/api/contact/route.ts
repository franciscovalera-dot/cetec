import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity-admin'
import { verifyRecaptcha } from '@/lib/recaptcha'

// Límites por campo para evitar payloads abusivos.
const MAX_EMAIL_LEN = 254
const MAX_NAME_LEN = 120
const MAX_COMPANY_LEN = 200
const MAX_PHONE_LEN = 30
const MAX_SUBJECT_LEN = 200
const MAX_MESSAGE_LEN = 5000
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

function trimTo(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined
  const v = value.trim()
  if (!v) return undefined
  return v.slice(0, max)
}

/** POST /api/contact — Alta pública de mensaje de contacto */
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const {
      nombre,
      apellidos,
      empresa,
      email,
      telefono,
      asunto,
      mensaje,
      captchaToken,
    } = data

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
    if (
      !mensaje ||
      typeof mensaje !== 'string' ||
      !mensaje.trim() ||
      mensaje.length > MAX_MESSAGE_LEN
    ) {
      return NextResponse.json({ error: 'El mensaje es obligatorio (máx. 5000 caracteres)' }, { status: 400 })
    }

    const doc = {
      _type: 'contactMessage' as const,
      nombre:    trimTo(nombre,    MAX_NAME_LEN),
      apellidos: trimTo(apellidos, MAX_NAME_LEN),
      empresa:   trimTo(empresa,   MAX_COMPANY_LEN),
      email:     email.trim().toLowerCase(),
      telefono:  trimTo(telefono,  MAX_PHONE_LEN),
      asunto:    trimTo(asunto,    MAX_SUBJECT_LEN),
      mensaje:   mensaje.trim().slice(0, MAX_MESSAGE_LEN),
      createdAt: new Date().toISOString(),
    }

    const created = await writeClient.create(doc)
    return NextResponse.json({ ok: true, id: created._id }, { status: 201 })
  } catch (err) {
    console.error('Error al crear mensaje de contacto:', err)
    return NextResponse.json(
      { error: 'Error al enviar el mensaje. Inténtalo de nuevo.' },
      { status: 500 }
    )
  }
}
