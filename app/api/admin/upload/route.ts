import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { writeClient } from '@/lib/sanity-admin'

async function checkAuth() {
  const cookieStore = await cookies()
  return !!cookieStore.get('admin_session')?.value
}

/** POST /api/admin/upload — Subir imagen o archivo a Sanity */
export async function POST(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const uploadType = formData.get('type') as string | null // 'image' | 'file'

  if (!file) {
    return NextResponse.json({ error: 'No se envió archivo' }, { status: 400 })
  }

  // Convertir File a Buffer para Sanity
  const buffer = Buffer.from(await file.arrayBuffer())

  // Determinar si es imagen o archivo genérico
  const assetType = uploadType === 'file' ? 'file' : 'image'

  const asset = await writeClient.assets.upload(assetType, buffer, {
    filename: file.name,
    contentType: file.type,
  })

  return NextResponse.json({
    assetId: asset._id,
    url: asset.url,
    originalFilename: file.name,
  })
}
