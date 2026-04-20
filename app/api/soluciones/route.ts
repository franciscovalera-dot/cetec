import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

/** GET /api/soluciones — Listado público de soluciones MarketTech */
export async function GET() {
  try {
    const soluciones = await client.fetch(
      `*[_type == "solucion"] | order(_createdAt asc) {
        _id, title, "slug": slug.current,
        "description": pt::text(description),
        tecnologia, sector, reto, material
      }`,
      {},
      { next: { revalidate: 60 } }
    )
    return NextResponse.json(soluciones)
  } catch (err) {
    console.error('Error al obtener soluciones:', err)
    return NextResponse.json([], { status: 500 })
  }
}
