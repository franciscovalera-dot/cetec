import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity-admin'
import { checkAuth } from '@/lib/admin-auth'

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
    // Borrado type-gated: solo permite eliminar si el documento es de tipo 'subscription'.
    // Esto previene que se use este endpoint para borrar cualquier documento de Sanity.
    const result = await writeClient.delete({
      query: '*[_id == $id && _type == "subscription"]',
      params: { id },
    })

    const deletedIds = (result?.results || [])
      .map((r: { id?: string }) => r.id)
      .filter(Boolean)

    if (deletedIds.length === 0) {
      return NextResponse.json({ error: 'Suscripción no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Error al eliminar suscripción:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
