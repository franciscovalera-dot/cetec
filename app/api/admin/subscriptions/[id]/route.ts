import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { writeClient } from '@/lib/sanity-admin'

async function checkAuth() {
  const cookieStore = await cookies()
  return !!cookieStore.get('admin_session')?.value
}

/** DELETE /api/admin/subscriptions/[id] — Eliminar una suscripción */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { id } = await params
    await writeClient.delete(id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Error al eliminar suscripción:', err)
    return NextResponse.json(
      { error: 'Error al eliminar. Verifica SANITY_API_WRITE_TOKEN.' },
      { status: 500 }
    )
  }
}
