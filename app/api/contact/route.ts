import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity-admin'
import { verifyRecaptcha } from '@/lib/recaptcha'

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

    if (!(await verifyRecaptcha(captchaToken))) {
      return NextResponse.json({ error: 'Verificación anti-bot fallida' }, { status: 400 })
    }

    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Email no válido' }, { status: 400 })
    }
    if (!mensaje || typeof mensaje !== 'string' || !mensaje.trim()) {
      return NextResponse.json({ error: 'El mensaje es obligatorio' }, { status: 400 })
    }

    const doc = {
      _type: 'contactMessage' as const,
      nombre:    nombre    ? String(nombre).trim()    : undefined,
      apellidos: apellidos ? String(apellidos).trim() : undefined,
      empresa:   empresa   ? String(empresa).trim()   : undefined,
      email:     String(email).trim().toLowerCase(),
      telefono:  telefono  ? String(telefono).trim()  : undefined,
      asunto:    asunto    ? String(asunto).trim()    : undefined,
      mensaje:   String(mensaje).trim(),
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
