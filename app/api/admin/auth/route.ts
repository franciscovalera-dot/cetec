import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { timingSafeEqual } from 'crypto'
import { signSession, checkAuth, ADMIN_COOKIE_NAME, ADMIN_COOKIE_MAX_AGE_S } from '@/lib/admin-auth'

/** Compara dos strings en tiempo constante para evitar timing attacks. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

/** POST /api/admin/auth — Login */
export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD no configurado en las variables de entorno')
    return NextResponse.json(
      { error: 'Autenticación no configurada en el servidor' },
      { status: 500 }
    )
  }

  const { password } = await req.json()

  if (typeof password !== 'string' || !safeEqual(password, adminPassword)) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }

  const token = signSession()
  if (!token) {
    return NextResponse.json(
      { error: 'Error firmando sesión' },
      { status: 500 }
    )
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ADMIN_COOKIE_MAX_AGE_S,
    path: '/',
  })

  return NextResponse.json({ ok: true })
}

/** DELETE /api/admin/auth — Logout */
export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE_NAME)
  return NextResponse.json({ ok: true })
}

/** GET /api/admin/auth — Check session */
export async function GET() {
  const authenticated = await checkAuth()
  if (!authenticated) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({ authenticated: true })
}
