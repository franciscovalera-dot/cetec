/**
 * SEED SCRIPT — Datos de prueba para el Observatorio Tecnológico CETEC
 *
 * Crea entradas de prueba para todas las secciones, temáticas y sectores.
 *
 * Uso:
 *   node scripts/seed.mjs
 *
 * Requiere en .env.local:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_WRITE_TOKEN
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// ── Cargar .env.local ────────────────────────────────────────────────────────
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
} catch {
  console.warn('No se pudo leer .env.local — usando variables de entorno del sistema')
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token     = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || projectId === 'tu-project-id') {
  console.error('ERROR: NEXT_PUBLIC_SANITY_PROJECT_ID no está configurado en .env.local')
  process.exit(1)
}
if (!token) {
  console.error('ERROR: SANITY_API_WRITE_TOKEN no está configurado en .env.local')
  console.error('Créalo en: https://www.sanity.io/manage → API → Tokens → Add API Token (Editor)')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Genera un slug limpio a partir de un texto */
function slug(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Genera un bloque de contenido Portable Text simple */
function bodyBlock(text) {
  return [
    {
      _type: 'block',
      _key: Math.random().toString(36).slice(2),
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }],
    },
  ]
}

/** Fecha ISO N días en el pasado */
function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

/** Fecha ISO N días en el futuro */
function daysFromNow(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

// ── Datos de prueba ──────────────────────────────────────────────────────────

const SECCIONES  = ['noticias', 'normativa', 'formacion', 'ayudas', 'markettech']
const TEMATICAS  = ['materiales', 'procesos', 'digitalizacion', 'reciclado', 'ecodiseno']
const SECTORES   = ['plastico', 'calzado', 'agroalimentario']

const SECCION_LABELS = {
  noticias:   'Noticias',
  normativa:  'Normativa',
  formacion:  'Formación',
  ayudas:     'Ayudas',
  markettech: 'MarketTech',
}

const TEMATICA_LABELS = {
  materiales:    'Materiales',
  procesos:      'Procesos',
  digitalizacion:'Digitalización',
  reciclado:     'Reciclado',
  ecodiseno:     'Ecodiseño',
}

const SECTOR_LABELS = {
  plastico:      'Plástico',
  calzado:       'Calzado',
  agroalimentario:'Agroalimentario',
}

// Títulos temáticos para hacer los datos más realistas
const TITULOS = {
  materiales: [
    'Nuevos polímeros biodegradables para envases sostenibles',
    'Avances en compuestos de fibra de carbono para calzado deportivo',
    'Materiales de base biológica en la industria agroalimentaria',
    'Nanocompuestos de alta resistencia para aplicaciones industriales',
    'Bioplásticos de segunda generación: propiedades y aplicaciones',
  ],
  procesos: [
    'Optimización del proceso de inyección de plásticos mediante IA',
    'Automatización robotizada en líneas de producción de calzado',
    'Tecnologías de procesado mínimo en la industria alimentaria',
    'Extrusión avanzada para perfiles técnicos de alta precisión',
    'Moldeo por compresión: reducción de tiempos de ciclo',
  ],
  digitalizacion: [
    'Gemelos digitales en la industria del plástico: casos de uso',
    'Industria 4.0 en fábricas de calzado: sensores y conectividad',
    'IoT agrícola: trazabilidad digital en la cadena agroalimentaria',
    'Machine learning para el control de calidad en producción',
    'Plataformas MES y su integración con ERP en PYMES industriales',
  ],
  reciclado: [
    'Circularidad del plástico: retos y oportunidades en Europa',
    'Reciclado mecánico de suelas de poliuretano post-consumo',
    'Valorización de residuos orgánicos en el sector agroalimentario',
    'Tecnologías de reciclado químico para polímeros mixtos',
    'Economía circular: modelos de negocio en el sector del calzado',
  ],
  ecodiseno: [
    'Ecodiseño de envases plásticos según la nueva directiva europea',
    'Diseño para el desmontaje en calzado: estrategias y materiales',
    'Análisis de ciclo de vida en productos agroalimentarios envasados',
    'Herramientas CAD/CAM para minimizar el desperdicio de material',
    'Guía práctica de ecodiseño para PYMES del sector plástico',
  ],
}

const EXCERPTS = {
  materiales:    'Investigación sobre el comportamiento de nuevos materiales en condiciones industriales extremas, con resultados prometedores para la reducción de costes y el impacto ambiental.',
  procesos:      'Análisis detallado de las mejoras de eficiencia obtenidas tras la implementación de nuevas tecnologías de proceso en instalaciones piloto.',
  digitalizacion:'Estudio de caso sobre la transformación digital de una planta de producción, incluyendo métricas de productividad y retorno de inversión.',
  reciclado:     'Informe sobre las tasas de reciclabilidad y las tecnologías disponibles para cerrar el ciclo de vida de los materiales en el sector industrial.',
  ecodiseno:     'Revisión de las mejores prácticas de ecodiseño aplicadas en empresas líderes del sector, con recomendaciones para su adopción en PYMES.',
}

// ── Generación de posts ──────────────────────────────────────────────────────

function buildPosts() {
  const posts = []
  let daysOffset = 0

  // Un post por cada combinación seccion × tematica × sector (75 posts)
  for (const seccion of SECCIONES) {
    for (const tematica of TEMATICAS) {
      for (const sector of SECTORES) {
        const titulosBase = TITULOS[tematica]
        const titleBase   = titulosBase[daysOffset % titulosBase.length]
        const title = `[${SECTOR_LABELS[sector]}] ${titleBase}`
        const slugVal = slug(`${seccion}-${tematica}-${sector}-${daysOffset}`)

        posts.push({
          _type: 'post',
          title,
          slug:        { _type: 'slug', current: slugVal },
          seccion,
          tematica,
          sector,
          publishedAt: daysAgo(daysOffset),
          excerpt:     EXCERPTS[tematica],
          tags:        [tematica, sector, seccion],
          body:        bodyBlock(
            `Este artículo pertenece a la sección de ${SECCION_LABELS[seccion]} y aborda la temática de ${TEMATICA_LABELS[tematica]} en el sector ${SECTOR_LABELS[sector]}. ${EXCERPTS[tematica]}`
          ),
        })

        daysOffset += 1
      }
    }
  }

  return posts
}

// ── Generación de eventos ────────────────────────────────────────────────────

const EVENT_DATA = [
  { title: 'Feria Internacional del Plástico 2026',         location: 'Düsseldorf, Alemania',     daysFromNowVal: 30  },
  { title: 'Jornada de Economía Circular en el Calzado',   location: 'Elche, Alicante',          daysFromNowVal: 45  },
  { title: 'Congreso Nacional de Agroalimentación e IA',   location: 'Murcia, España',           daysFromNowVal: 60  },
  { title: 'Workshop: Ecodiseño en la Industria 4.0',      location: 'Online / Webinar',          daysFromNowVal: 15  },
  { title: 'Encuentro de Innovación en Materiales Plásticos', location: 'Barcelona, España',     daysFromNowVal: 90  },
  { title: 'Seminario de Normativa Europea de Envases',    location: 'Madrid, España',           daysFromNowVal: 20  },
  { title: 'Mesa Redonda: Digitalización en PYMES Industriales', location: 'Valencia, España',  daysFromNowVal: 55  },
  { title: 'Curso Avanzado en Reciclado Químico de Polímeros', location: 'Tarragona, España',   daysFromNowVal: 35  },
  // Pasados
  { title: 'Plastics Innovation Summit 2025',              location: 'Frankfurt, Alemania',      daysAgoVal: 20  },
  { title: 'Jornada de Formación en Bioplásticos',         location: 'Castellón, España',        daysAgoVal: 45  },
  { title: 'Congreso CETEC: Materiales del Futuro',        location: 'Alhama de Murcia, España', daysAgoVal: 90  },
  { title: 'Hackathon de Sostenibilidad Industrial',       location: 'Online',                   daysAgoVal: 10  },
]

function buildEvents() {
  return EVENT_DATA.map((e, i) => {
    const dateVal = e.daysFromNowVal != null ? daysFromNow(e.daysFromNowVal) : daysAgo(e.daysAgoVal)
    const endDateVal = e.daysFromNowVal != null ? daysFromNow(e.daysFromNowVal + 2) : daysAgo(e.daysAgoVal - 1)
    return {
      _type: 'agenda',
      title: e.title,
      slug:  { _type: 'slug', current: slug(e.title) + `-${i}` },
      date:  dateVal,
      endDate: endDateVal,
      location: e.location,
      description: bodyBlock(`Evento destacado del sector industrial. ${e.title} se celebrará en ${e.location}. Una oportunidad única para conocer las últimas innovaciones y tendencias del sector.`),
      link: 'https://cetec.es',
    }
  })
}

// ── Generación de términos del glosario ─────────────────────────────────────

const GLOSSARY_DATA = [
  { term: 'Bioplástico',                    tematica: 'materiales',    sector: 'plastico',        def: 'Material plástico derivado de fuentes biológicas renovables, como el almidón de maíz o la caña de azúcar, en contraposición a los plásticos de origen petroquímico.' },
  { term: 'Economía Circular',              tematica: 'reciclado',     sector: 'plastico',        def: 'Modelo económico que busca eliminar los residuos y la contaminación desde el diseño, mantener los productos y materiales en uso el mayor tiempo posible y regenerar los sistemas naturales.' },
  { term: 'Ecodiseño',                      tematica: 'ecodiseno',     sector: 'calzado',         def: 'Enfoque de diseño de productos que integra consideraciones ambientales en todas las etapas del ciclo de vida, desde la extracción de materias primas hasta el fin de vida del producto.' },
  { term: 'Gemelo Digital',                 tematica: 'digitalizacion',sector: 'plastico',        def: 'Representación virtual de un objeto físico, proceso o sistema que se actualiza en tiempo real a partir de datos de sensores, permitiendo la simulación y optimización.' },
  { term: 'Inyección de plástico',          tematica: 'procesos',      sector: 'plastico',        def: 'Proceso de fabricación en el que el material plástico fundido se inyecta a presión en un molde para obtener piezas con geometrías complejas de forma reproducible.' },
  { term: 'Polímero',                       tematica: 'materiales',    sector: 'plastico',        def: 'Macromolécula formada por la repetición de unidades estructurales menores llamadas monómeros. Los plásticos, cauchos y fibras sintéticas son ejemplos de polímeros.' },
  { term: 'Análisis de Ciclo de Vida (ACV)',tematica: 'ecodiseno',     sector: 'agroalimentario', def: 'Metodología para evaluar el impacto ambiental de un producto a lo largo de toda su vida, desde la extracción de materias primas hasta su disposición final.' },
  { term: 'Industria 4.0',                  tematica: 'digitalizacion',sector: 'calzado',         def: 'Cuarta revolución industrial caracterizada por la integración de tecnologías digitales avanzadas en los procesos productivos: IoT, big data, IA, robótica colaborativa y fabricación aditiva.' },
  { term: 'Extrusión',                      tematica: 'procesos',      sector: 'plastico',        def: 'Proceso de fabricación continua en el que el material (plástico, metal, etc.) se empuja a través de una boquilla con la forma deseada para obtener perfiles, tubos o láminas.' },
  { term: 'Reciclado Mecánico',             tematica: 'reciclado',     sector: 'plastico',        def: 'Proceso de reciclaje en el que los residuos plásticos se trituran, lavan y refunden para obtener nuevo material granulado que puede procesarse de nuevo sin alterar su estructura química.' },
  { term: 'Reciclado Químico',              tematica: 'reciclado',     sector: 'plastico',        def: 'Conjunto de procesos que descomponen los polímeros plásticos en sus componentes químicos básicos (monómeros, combustibles, productos químicos), permitiendo reciclar materiales no aptos para el reciclado mecánico.' },
  { term: 'Poliuretano',                    tematica: 'materiales',    sector: 'calzado',         def: 'Polímero versátil utilizado en espumas, adhesivos, recubrimientos y elastómeros. Muy empleado en la fabricación de suelas de calzado por su ligereza, durabilidad y amortiguación.' },
  { term: 'Trazabilidad',                   tematica: 'digitalizacion',sector: 'agroalimentario', def: 'Capacidad de rastrear el historial, aplicación o localización de un producto a lo largo de toda la cadena de suministro, desde la materia prima hasta el consumidor final.' },
  { term: 'Norma ISO 14001',                tematica: 'ecodiseno',     sector: 'agroalimentario', def: 'Estándar internacional que especifica los requisitos para un Sistema de Gestión Ambiental (SGA) que una organización puede utilizar para mejorar su desempeño ambiental.' },
  { term: 'Plástico de un solo uso',        tematica: 'reciclado',     sector: 'plastico',        def: 'Productos plásticos diseñados para ser usados una sola vez antes de ser desechados. La Directiva Europea SUP establece restricciones progresivas sobre estos productos.' },
  { term: 'Fibra de carbono',               tematica: 'materiales',    sector: 'calzado',         def: 'Material compuesto por filamentos de carbono de alta pureza con una relación resistencia/peso excepcional, utilizado en aplicaciones que requieren ligereza y rigidez estructural.' },
  { term: 'Moldeo por compresión',          tematica: 'procesos',      sector: 'calzado',         def: 'Proceso de fabricación en el que el material (caucho, plástico termoestable, compuesto) se coloca en un molde abierto y se prensa entre las dos mitades del molde calentado.' },
  { term: 'IoT Industrial (IIoT)',          tematica: 'digitalizacion',sector: 'agroalimentario', def: 'Aplicación del Internet de las Cosas en entornos industriales: sensores conectados en maquinaria, líneas de producción y activos industriales para monitorizar y optimizar operaciones en tiempo real.' },
  { term: 'Huella de Carbono',              tematica: 'ecodiseno',     sector: 'plastico',        def: 'Medida de la cantidad total de gases de efecto invernadero emitidos directa o indirectamente por una persona, organización, evento o producto, expresada en equivalentes de CO₂.' },
  { term: 'Compuesto de matriz polimérica', tematica: 'materiales',    sector: 'plastico',        def: 'Material formado por una matriz plástica reforzada con fibras (de vidrio, carbono, aramida, etc.) que combina las propiedades de ambos componentes para obtener mejores prestaciones mecánicas.' },
]

function buildGlossary() {
  return GLOSSARY_DATA.map((g, i) => ({
    _type: 'glossary',
    term:     g.term,
    slug:     { _type: 'slug', current: slug(g.term) + `-${i}` },
    tematica: g.tematica,
    sector:   g.sector,
    definition: bodyBlock(g.def),
  }))
}

// ── Generación de documentos técnicos ───────────────────────────────────────

const TIPOS_DOCUMENTO = ['articulo-tecnico', 'boletin-vigilancia', 'guia-buenas-practicas', 'informe-estado-arte']
const TIPO_DOC_LABELS = {
  'articulo-tecnico':       'Artículo técnico',
  'boletin-vigilancia':     'Boletín de vigilancia',
  'guia-buenas-practicas':  'Guía de buenas prácticas',
  'informe-estado-arte':    'Informe de Estado del Arte',
}

const DOC_TITLES = {
  'articulo-tecnico': [
    'Propiedades mecánicas de polímeros reciclados post-consumo',
    'Análisis comparativo de adhesivos para calzado deportivo',
    'Impacto de la temperatura en la extrusión de PET reciclado',
  ],
  'boletin-vigilancia': [
    'Vigilancia tecnológica: nuevos materiales biodegradables Q1 2026',
    'Tendencias en digitalización industrial — Boletín marzo 2026',
    'Monitorización de patentes en reciclado químico',
  ],
  'guia-buenas-practicas': [
    'Guía de ecodiseño para envases plásticos flexibles',
    'Buenas prácticas en la gestión de residuos en la industria del calzado',
    'Manual de implementación de economía circular en PYMES',
  ],
  'informe-estado-arte': [
    'Estado del arte: bioplásticos de tercera generación',
    'Informe sectorial: digitalización en la industria agroalimentaria',
    'Panorama actual del reciclado químico en Europa',
  ],
}

function buildDocuments() {
  const docs = []
  let daysOffset = 0

  for (const tipo of TIPOS_DOCUMENTO) {
    const titles = DOC_TITLES[tipo]
    for (let i = 0; i < titles.length; i++) {
      const sector = SECTORES[i % SECTORES.length]
      docs.push({
        _type: 'document',
        title: titles[i],
        slug: { _type: 'slug', current: slug(titles[i]) },
        tipoDocumento: tipo,
        sector,
        date: daysAgo(daysOffset),
        description: `${TIPO_DOC_LABELS[tipo]} del sector ${SECTOR_LABELS[sector]}. Documento de referencia para profesionales del sector.`,
        fileType: 'pdf',
      })
      daysOffset += 3
    }
  }

  return docs
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🌱 CETEC Seed Script`)
  console.log(`   Proyecto: ${projectId}`)
  console.log(`   Dataset:  ${dataset}\n`)

  // Verificar conexión
  try {
    await client.fetch('*[false]')
    console.log('✓ Conexión con Sanity OK\n')
  } catch (err) {
    console.error('✗ No se puede conectar con Sanity:', err.message)
    process.exit(1)
  }

  // ── Posts ──────────────────────────────────────────────────────────────────
  const posts = buildPosts()
  console.log(`Insertando ${posts.length} posts...`)
  let postCount = 0
  for (const post of posts) {
    try {
      await client.create(post)
      postCount++
      process.stdout.write(`\r  ${postCount}/${posts.length} posts creados`)
    } catch (err) {
      console.error(`\n  ✗ Error en post "${post.title}": ${err.message}`)
    }
  }
  console.log(`\n  ✓ ${postCount} posts creados`)

  // ── Eventos ────────────────────────────────────────────────────────────────
  const events = buildEvents()
  console.log(`\nInsertando ${events.length} eventos de agenda...`)
  let eventCount = 0
  for (const ev of events) {
    try {
      await client.create(ev)
      eventCount++
    } catch (err) {
      console.error(`  ✗ Error en evento "${ev.title}": ${err.message}`)
    }
  }
  console.log(`  ✓ ${eventCount} eventos creados`)

  // ── Documentos ─────────────────────────────────────────────────────────────
  const documents = buildDocuments()
  console.log(`\nInsertando ${documents.length} documentos técnicos...`)
  let docCount = 0
  for (const doc of documents) {
    try {
      await client.create(doc)
      docCount++
    } catch (err) {
      console.error(`  ✗ Error en documento "${doc.title}": ${err.message}`)
    }
  }
  console.log(`  ✓ ${docCount} documentos creados`)

  // ── Glosario ───────────────────────────────────────────────────────────────
  const glossary = buildGlossary()
  console.log(`\nInsertando ${glossary.length} términos del glosario...`)
  let glossaryCount = 0
  for (const term of glossary) {
    try {
      await client.create(term)
      glossaryCount++
    } catch (err) {
      console.error(`  ✗ Error en término "${term.term}": ${err.message}`)
    }
  }
  console.log(`  ✓ ${glossaryCount} términos creados`)

  // ── Resumen ────────────────────────────────────────────────────────────────
  console.log('\n─────────────────────────────────────────')
  console.log('✅ Seed completado:')
  console.log(`   • ${postCount} posts (${SECCIONES.length} secciones × ${TEMATICAS.length} temáticas × ${SECTORES.length} sectores)`)
  console.log(`   • ${eventCount} eventos de agenda`)
  console.log(`   • ${docCount} documentos técnicos`)
  console.log(`   • ${glossaryCount} términos de glosario`)
  console.log('─────────────────────────────────────────\n')
}

main().catch((err) => {
  console.error('Error fatal:', err)
  process.exit(1)
})
