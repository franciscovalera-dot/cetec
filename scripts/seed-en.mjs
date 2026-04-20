/**
 * SEED SCRIPT — Posts en inglés para probar el filtro de idioma
 * Uso: node scripts/seed-en.mjs
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../.env.local')
try {
  const envContent = readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const val = trimmed.slice(eqIdx + 1).trim()
    if (key && !process.env[key]) process.env[key] = val
  }
} catch { /* ignore */ }

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token:     process.env.SANITY_API_WRITE_TOKEN,
  useCdn:    false,
})

function slug(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
function bodyBlock(text) {
  return [{ _type: 'block', _key: Math.random().toString(36).slice(2), style: 'normal', markDefs: [], children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }] }]
}
function daysAgo(n) {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString()
}

const EN_POSTS = [
  {
    seccion: 'noticias', tematica: 'materiales', sector: 'plastico', daysAgo: 3,
    title: 'Bio-based polymers: new frontiers in sustainable packaging',
    excerpt: 'An in-depth look at the latest advances in bio-based and compostable polymers for industrial packaging applications, focusing on performance and cost reduction.',
    body: 'Research into bio-based polymers is accelerating across Europe, driven by regulatory pressure and growing demand for sustainable packaging solutions. This article reviews the most promising materials currently under development.',
  },
  {
    seccion: 'noticias', tematica: 'digitalizacion', sector: 'calzado', daysAgo: 5,
    title: 'Digital twins in footwear manufacturing: a practical guide',
    excerpt: 'How leading footwear brands are deploying digital twin technology to reduce prototyping costs and speed up time-to-market.',
    body: 'Digital twin technology enables manufacturers to simulate production processes in real time, identifying bottlenecks and optimizing material usage before physical production begins. Several Spanish footwear companies have already reported significant cost savings.',
  },
  {
    seccion: 'normativa', tematica: 'reciclado', sector: 'plastico', daysAgo: 8,
    title: 'EU Packaging Regulation 2025: what plastic manufacturers need to know',
    excerpt: 'A summary of the key changes introduced by the new EU Packaging and Packaging Waste Regulation and their implications for plastic producers.',
    body: 'The revised EU Packaging Regulation sets ambitious recycled content targets for plastic packaging. Manufacturers must now track material composition across the full supply chain and meet reporting obligations starting in 2025.',
  },
  {
    seccion: 'formacion', tematica: 'ecodiseno', sector: 'agroalimentario', daysAgo: 12,
    title: 'Ecodesign fundamentals for food packaging: online course',
    excerpt: 'A free online course covering life cycle assessment, material selection, and design-for-recycling principles applied to food and agri-food packaging.',
    body: 'This course is designed for product designers and engineers working in the agri-food sector who want to integrate ecodesign principles into their workflows. Topics include LCA methodology, recyclability assessment, and EU regulatory requirements.',
  },
  {
    seccion: 'ayudas', tematica: 'procesos', sector: 'plastico', daysAgo: 15,
    title: 'EU Horizon grants for industrial process innovation — 2025 call',
    excerpt: 'Overview of the latest Horizon Europe funding opportunities for companies developing innovative manufacturing processes in the plastics sector.',
    body: 'The 2025 Horizon Europe call for industrial transformation includes funding of up to €5M per project for SMEs and large enterprises investing in cleaner and more efficient production processes. Deadlines and eligibility criteria are detailed below.',
  },
  {
    seccion: 'noticias', tematica: 'reciclado', sector: 'calzado', daysAgo: 18,
    title: 'Chemical recycling of polyurethane soles: industry update',
    excerpt: 'New chemical recycling technologies promise to close the loop on post-consumer polyurethane footwear components.',
    body: 'Chemical recycling of polyurethane is gaining traction as a complement to mechanical recycling. Several pilot projects in Spain and Italy are demonstrating the technical and economic viability of recovering monomer-grade material from shoe soles.',
  },
  {
    seccion: 'markettech', tematica: 'digitalizacion', sector: 'agroalimentario', daysAgo: 20,
    title: 'Smart sensors for cold chain monitoring: technology showcase',
    excerpt: 'An overview of the latest IoT sensor solutions available for real-time temperature and humidity monitoring in agri-food logistics.',
    body: 'Cold chain integrity is critical for food safety and quality. This technology showcase presents solutions from leading suppliers, comparing accuracy, battery life, connectivity protocols, and integration with existing ERP and WMS platforms.',
  },
  {
    seccion: 'noticias', tematica: 'materiales', sector: 'agroalimentario', daysAgo: 22,
    title: 'Edible coatings as an alternative to plastic films in fresh produce',
    excerpt: 'Research from the University of Murcia explores protein- and polysaccharide-based edible coatings as a plastic-free solution for extending shelf life.',
    body: 'Edible coatings derived from whey protein, chitosan, and starch are being evaluated as direct replacements for low-density polyethylene films used in fresh produce packaging. Early results show comparable shelf-life extension with a significantly reduced environmental footprint.',
  },
  {
    seccion: 'normativa', tematica: 'ecodiseno', sector: 'calzado', daysAgo: 25,
    title: 'Ecodesign for Sustainable Products Regulation: impact on footwear',
    excerpt: 'The ESPR introduces mandatory durability, reparability, and recyclability requirements that will affect footwear design and manufacturing from 2026.',
    body: 'The Ecodesign for Sustainable Products Regulation (ESPR) extends the ecodesign framework beyond energy-related products for the first time. Footwear brands must prepare for new mandatory requirements around material labelling, disassembly instructions, and recycled content claims.',
  },
  {
    seccion: 'ayudas', tematica: 'materiales', sector: 'calzado', daysAgo: 28,
    title: 'IVACE grants for R&D in advanced materials — Valencia 2025',
    excerpt: 'The Valencia regional government has opened a new funding line supporting R&D projects in advanced and sustainable materials for the footwear industry.',
    body: 'IVACE has announced a €3M funding round for collaborative R&D projects between Valencian footwear companies and research centres. Priority areas include bio-based materials, recycled content integration, and material characterisation.',
  },
]

async function main() {
  console.log('\n🌱 Seed EN — Posts en inglés')
  console.log(`   Proyecto: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}\n`)

  let count = 0
  for (const [i, p] of EN_POSTS.entries()) {
    const slugVal = slug(p.title) + `-en-${i}`
    try {
      await client.create({
        _type: 'post',
        title:       p.title,
        slug:        { _type: 'slug', current: slugVal },
        seccion:     p.seccion,
        tematica:    p.tematica,
        sector:      p.sector,
        idioma:      'en',
        publishedAt: daysAgo(p.daysAgo),
        excerpt:     p.excerpt,
        tags:        [p.tematica, p.sector, p.seccion, 'en'],
        body:        bodyBlock(p.body),
      })
      count++
      console.log(`  ✓ ${p.title}`)
    } catch (err) {
      console.error(`  ✗ ${p.title}: ${err.message}`)
    }
  }

  console.log(`\n✅ ${count} posts en inglés creados\n`)
}

main().catch((err) => { console.error(err); process.exit(1) })
