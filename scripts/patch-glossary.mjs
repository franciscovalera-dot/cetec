/**
 * Parcha los términos de glosario existentes con tematica + sector
 * y elimina duplicados. Uso: node scripts/patch-glossary.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
try {
  const env = readFileSync(resolve(__dirname, '../.env.local'), 'utf-8')
  for (const line of env.split('\n')) {
    const t = line.trim(); if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('='); if (eq === -1) continue
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim()
    if (k && !process.env[k]) process.env[k] = v
  }
} catch { /* ignore */ }

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token:     process.env.SANITY_API_WRITE_TOKEN,
  useCdn:    false,
})

// Mapa término → tematica + sector
const DATA = {
  'Bioplástico':                    { tematica: 'materiales',    sector: 'plastico' },
  'Economía Circular':              { tematica: 'reciclado',     sector: 'plastico' },
  'Ecodiseño':                      { tematica: 'ecodiseno',     sector: 'calzado' },
  'Gemelo Digital':                 { tematica: 'digitalizacion',sector: 'plastico' },
  'Inyección de plástico':          { tematica: 'procesos',      sector: 'plastico' },
  'Polímero':                       { tematica: 'materiales',    sector: 'plastico' },
  'Análisis de Ciclo de Vida (ACV)':{ tematica: 'ecodiseno',     sector: 'agroalimentario' },
  'Industria 4.0':                  { tematica: 'digitalizacion',sector: 'calzado' },
  'Extrusión':                      { tematica: 'procesos',      sector: 'plastico' },
  'Reciclado Mecánico':             { tematica: 'reciclado',     sector: 'plastico' },
  'Reciclado Químico':              { tematica: 'reciclado',     sector: 'plastico' },
  'Poliuretano':                    { tematica: 'materiales',    sector: 'calzado' },
  'Trazabilidad':                   { tematica: 'digitalizacion',sector: 'agroalimentario' },
  'Norma ISO 14001':                { tematica: 'ecodiseno',     sector: 'agroalimentario' },
  'Plástico de un solo uso':        { tematica: 'reciclado',     sector: 'plastico' },
  'Fibra de carbono':               { tematica: 'materiales',    sector: 'calzado' },
  'Moldeo por compresión':          { tematica: 'procesos',      sector: 'calzado' },
  'IoT Industrial (IIoT)':          { tematica: 'digitalizacion',sector: 'agroalimentario' },
  'Huella de Carbono':              { tematica: 'ecodiseno',     sector: 'plastico' },
  'Compuesto de matriz polimérica': { tematica: 'materiales',    sector: 'plastico' },
}

async function main() {
  console.log('\n🔧 Patch glosario\n')

  const all = await client.fetch(`*[_type == "glossary"] { _id, term } | order(_createdAt asc)`)
  console.log(`Total términos en Sanity: ${all.length}`)

  // Agrupar por término para detectar duplicados
  const byTerm = {}
  for (const t of all) {
    if (!byTerm[t.term]) byTerm[t.term] = []
    byTerm[t.term].push(t._id)
  }

  let patched = 0, deleted = 0

  for (const [term, ids] of Object.entries(byTerm)) {
    const keep = ids[0]           // el más antiguo
    const dupes = ids.slice(1)    // los demás son duplicados

    // Borrar duplicados
    for (const id of dupes) {
      await client.delete(id)
      deleted++
    }

    // Parchear el que se queda
    const fields = DATA[term]
    if (fields) {
      await client.patch(keep).set(fields).commit()
      patched++
      console.log(`  ✓ ${term}`)
    } else {
      console.log(`  ~ ${term} (sin datos de temática/sector)`)
    }
  }

  console.log(`\n✅ ${patched} términos parchados, ${deleted} duplicados eliminados\n`)
}

main().catch(e => { console.error(e); process.exit(1) })
