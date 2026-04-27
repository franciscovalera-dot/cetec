/**
 * RESET POSTS — Borra todos los `post` y crea entradas nuevas con todos los campos
 * que consumen las páginas de listado y detalle del Observatorio CETEC.
 *
 * Uso:
 *   node scripts/reset-posts.mjs            # borra y vuelve a crear
 *   node scripts/reset-posts.mjs --dry-run  # solo cuenta lo que haría
 *
 * Requiere en .env.local:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_WRITE_TOKEN
 *
 * No toca eventos de agenda, documentos ni glosario.
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
const dryRun    = process.argv.includes('--dry-run')

if (!projectId || projectId === 'tu-project-id') {
  console.error('ERROR: NEXT_PUBLIC_SANITY_PROJECT_ID no está configurado en .env.local')
  process.exit(1)
}
if (!token) {
  console.error('ERROR: SANITY_API_WRITE_TOKEN no está configurado en .env.local')
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

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96)
}

function randomKey() {
  return Math.random().toString(36).slice(2, 10)
}

/** Convierte una lista de párrafos a Portable Text */
function paragraphsToBlocks(paragraphs) {
  return paragraphs.map((text) => ({
    _type: 'block',
    _key: randomKey(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: randomKey(), text, marks: [] }],
  }))
}

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

// ── Taxonomía ────────────────────────────────────────────────────────────────

// Solo secciones con página de detalle funcional (catch-all /[category]/[slug]).
// 'markettech' y 'agenda' tienen rutas específicas para otros document types
// (solucion, agenda) y un post con esas secciones daría 404 al hacer clic.
const SECCIONES = ['noticias', 'normativa', 'formacion', 'ayudas']
const TEMATICAS = ['materiales', 'procesos', 'digitalizacion', 'reciclado', 'ecodiseno']
const SECTORES  = ['plastico', 'calzado', 'agroalimentario']

const SECCION_LABEL = {
  noticias: 'Noticias',
  normativa: 'Normativa',
  formacion: 'Formación',
  ayudas: 'Ayudas',
}

const TEMATICA_LABEL = {
  materiales: 'Materiales',
  procesos: 'Procesos',
  digitalizacion: 'Digitalización',
  reciclado: 'Reciclado',
  ecodiseno: 'Ecodiseño',
}

const SECTOR_LABEL = {
  plastico: 'Plástico',
  calzado: 'Calzado',
  agroalimentario: 'Agroalimentario',
}

// Tecnologías típicas asociadas a cada temática (para el sidebar de detalle)
const TECNOLOGIAS_POR_TEMATICA = {
  materiales: ['Bioplásticos', 'Compuestos avanzados', 'Nanomateriales', 'PLA', 'Polímeros biodegradables'],
  procesos: ['Inyección', 'Extrusión', 'Moldeo por compresión', 'Fabricación aditiva', 'Automatización'],
  digitalizacion: ['IoT Industrial', 'Gemelos digitales', 'Machine Learning', 'Industria 4.0', 'Big Data'],
  reciclado: ['Reciclado mecánico', 'Reciclado químico', 'Pirólisis', 'Valorización energética', 'Compostaje industrial'],
  ecodiseno: ['Análisis de Ciclo de Vida', 'Huella de carbono', 'Diseño para el desmontaje', 'ISO 14001', 'Etiquetado ambiental'],
}

// Descriptores típicos por sector
const DESCRIPTORES_POR_SECTOR = {
  plastico: ['Envases', 'Inyección', 'Polímeros', 'Sostenibilidad', 'PYMES'],
  calzado: ['Suelas', 'Adhesivos', 'Confort', 'Diseño', 'Trazabilidad'],
  agroalimentario: ['Trazabilidad', 'Cadena de frío', 'Embalaje activo', 'Seguridad alimentaria', 'Bioeconomía'],
}

// Plantillas de título por temática (variadas, sin prefijos artificiales)
const TITULOS = {
  materiales: {
    plastico: [
      'Polímeros biodegradables de nueva generación para envases industriales',
      'Avances en compuestos reforzados con fibra de vidrio reciclada',
      'Bioplásticos a partir de residuos agrícolas: oportunidad para el sector',
      'Caracterización mecánica de polímeros reciclados post-consumo',
      'Nanomateriales aplicados a films barrera de alta prestación',
    ],
    calzado: [
      'Materiales de origen biológico para suelas técnicas',
      'Espumas EVA recicladas: viabilidad técnica en calzado deportivo',
      'Caucho reciclado y su aplicación en componentes de calzado',
      'Tejidos inteligentes incorporados al diseño de calzado',
      'Alternativas al cuero animal: materiales innovadores en auge',
    ],
    agroalimentario: [
      'Films activos a base de extractos naturales para envasado alimentario',
      'Bioplásticos compostables certificados para envases en contacto con alimentos',
      'Recubrimientos comestibles para alargar la vida útil de productos frescos',
      'Materiales con propiedades antimicrobianas para la industria alimentaria',
      'Envases biobasados a partir de subproductos del sector agro',
    ],
  },
  procesos: {
    plastico: [
      'Optimización de la inyección de plásticos mediante control adaptativo',
      'Extrusión de perfiles técnicos: parámetros críticos y mejora continua',
      'Reducción de tiempos de ciclo en moldeo por inyección con asistencia IA',
      'Fabricación aditiva industrial para utillaje en líneas de producción',
      'Termoconformado avanzado para envases monomaterial reciclables',
    ],
    calzado: [
      'Automatización robotizada en líneas de ensamblado de calzado',
      'Inyección directa de suelas: optimización energética del proceso',
      'Procesos de unión sin adhesivos para mejorar la reciclabilidad',
      'Corte láser de pieles y textiles con tecnología CAM avanzada',
      'Sistemas de inspección óptica automatizada en líneas de producción',
    ],
    agroalimentario: [
      'Procesado mínimo y tecnologías no térmicas en la industria alimentaria',
      'Líneas de envasado en atmósfera modificada de alta cadencia',
      'Procesos de pasteurización por alta presión: aplicaciones reales',
      'Optimización energética en plantas de transformación alimentaria',
      'Limpieza CIP automatizada y reducción de consumo de agua',
    ],
  },
  digitalizacion: {
    plastico: [
      'Gemelos digitales aplicados a moldeo por inyección: caso de uso',
      'Sensorización de máquinas extrusoras para mantenimiento predictivo',
      'Integración MES–ERP en plantas de transformación de plástico',
      'Visión artificial para control de calidad en piezas inyectadas',
      'Plataformas de monitorización energética en fábrica de polímeros',
    ],
    calzado: [
      'Industria 4.0 en fábricas de calzado: hoja de ruta para PYMES',
      'Pasaporte digital de producto: implementación en el sector calzado',
      'Plataformas de personalización masiva para calzado a medida',
      'Trazabilidad digital de la cadena de suministro en calzado',
      'Realidad aumentada aplicada al diseño y prototipado de calzado',
    ],
    agroalimentario: [
      'IoT y trazabilidad blockchain en la cadena agroalimentaria',
      'Modelos predictivos de demanda en industria alimentaria',
      'Sensores de calidad inline para procesos de envasado',
      'Plataformas de monitorización de la cadena de frío en tiempo real',
      'Visión artificial para clasificación automática de producto fresco',
    ],
  },
  reciclado: {
    plastico: [
      'Reciclado químico de poliolefinas: estado del arte y barreras',
      'Circularidad del PET: avances en reciclado mecánico de calidad alimentaria',
      'Pirólisis de residuos plásticos mixtos: viabilidad industrial',
      'Despolimerización enzimática del PET: la próxima frontera',
      'Diseño para el reciclado en envases multicapa',
    ],
    calzado: [
      'Reciclado de suelas de poliuretano post-consumo: rutas tecnológicas',
      'Modelos de logística inversa en el sector calzado',
      'Recuperación de materiales en calzado de un solo uso',
      'Programas de devolución y reciclado: experiencias del sector',
      'Reciclado mecánico de TPU: aplicaciones en componentes deportivos',
    ],
    agroalimentario: [
      'Valorización de residuos orgánicos del sector agroalimentario',
      'Compostaje industrial de envases biodegradables: requisitos',
      'Subproductos de la industria láctea como materia prima secundaria',
      'Bioeconomía circular en la industria del vino y aceite',
      'Reciclado de envases multicapa en la cadena alimentaria',
    ],
  },
  ecodiseno: {
    plastico: [
      'Ecodiseño según la nueva normativa europea PPWR para envases',
      'Análisis de Ciclo de Vida comparativo en envases plásticos',
      'Reducción de huella de carbono en piezas inyectadas',
      'Diseño monomaterial para mejorar tasas de reciclado',
      'Etiquetado ambiental y declaraciones EPD en producto plástico',
    ],
    calzado: [
      'Estrategias de ecodiseño aplicadas al desarrollo de calzado',
      'Diseño para el desmontaje en calzado deportivo: materiales y uniones',
      'Calzado con menor huella ambiental: criterios de selección de materiales',
      'Pasaporte digital y ecodiseño: integración en el sector calzado',
      'Análisis de Ciclo de Vida de un par de zapatillas: hallazgos clave',
    ],
    agroalimentario: [
      'Ecodiseño de envases alimentarios: pautas para PYMES',
      'Análisis de Ciclo de Vida en productos frescos envasados',
      'Reducción de plástico en envases sin perder funcionalidad',
      'Etiquetado de huella ambiental en producto alimentario',
      'Diseño de envases para la economía circular del sector agro',
    ],
  },
}

// Cuerpo del artículo: 3 párrafos contextualizados
function buildBody({ seccion, tematica, sector, title }) {
  const seccionFrase = {
    noticias: 'Esta noticia recoge los últimos avances',
    normativa: 'Este análisis normativo aborda las implicaciones regulatorias',
    formacion: 'Esta acción formativa cubre los fundamentos y la aplicación práctica',
    ayudas: 'Esta convocatoria de ayudas ofrece financiación específica',
  }[seccion]

  const p1 = `${seccionFrase} en el ámbito de ${TEMATICA_LABEL[tematica].toLowerCase()} aplicado al sector ${SECTOR_LABEL[sector].toLowerCase()}. ${title} representa una línea de trabajo estratégica para las empresas del sector que buscan mejorar su competitividad y reducir su impacto ambiental.`

  const p2 = `El Observatorio Tecnológico CETEC ha identificado esta tendencia como una de las áreas con mayor potencial de transformación para PYMES industriales. Entre los aspectos clave destacan la reducción del consumo de recursos, la mejora de la trazabilidad y la incorporación de criterios de circularidad desde la fase de diseño. Los casos de uso recientes muestran retornos de inversión razonables en plazos de 18 a 36 meses.`

  const p3 = `Para empresas interesadas en profundizar, el Observatorio pone a disposición documentación técnica complementaria, jornadas formativas y un canal directo de consulta con el equipo técnico de CETEC. El objetivo es facilitar la transferencia de conocimiento entre los grupos de investigación y el tejido productivo de los sectores ${SECTOR_LABEL.plastico.toLowerCase()}, ${SECTOR_LABEL.calzado.toLowerCase()} y ${SECTOR_LABEL.agroalimentario.toLowerCase()}.`

  return paragraphsToBlocks([p1, p2, p3])
}

function buildExcerpt({ tematica, sector }) {
  const map = {
    materiales: `Análisis de nuevos materiales aplicados al sector ${SECTOR_LABEL[sector].toLowerCase()} con foco en propiedades técnicas, sostenibilidad y viabilidad industrial.`,
    procesos: `Mejoras de proceso documentadas en instalaciones industriales del sector ${SECTOR_LABEL[sector].toLowerCase()}, con resultados de eficiencia y calidad.`,
    digitalizacion: `Casos de transformación digital en el sector ${SECTOR_LABEL[sector].toLowerCase()}, con métricas de productividad y retorno de inversión.`,
    reciclado: `Tecnologías de reciclado y circularidad aplicables al sector ${SECTOR_LABEL[sector].toLowerCase()}, con barreras y oportunidades identificadas.`,
    ecodiseno: `Buenas prácticas de ecodiseño aplicadas en empresas del sector ${SECTOR_LABEL[sector].toLowerCase()}, con recomendaciones para PYMES.`,
  }
  return map[tematica]
}

// ── Construir posts ──────────────────────────────────────────────────────────

function buildPosts() {
  const posts = []
  let offset = 0

  for (const seccion of SECCIONES) {
    for (const tematica of TEMATICAS) {
      for (const sector of SECTORES) {
        const titles = TITULOS[tematica][sector]
        const title = titles[offset % titles.length]
        const slugBase = slugify(`${title}-${seccion}`)
        const slug = `${slugBase}-${offset}`.slice(0, 96)

        posts.push({
          _type: 'post',
          title,
          slug: { _type: 'slug', current: slug },
          seccion,
          tematica,
          sector,
          idioma: 'es',
          publishedAt: daysAgo(offset),
          excerpt: buildExcerpt({ tematica, sector }),
          body: buildBody({ seccion, tematica, sector, title }),
          tags: [TEMATICA_LABEL[tematica], SECTOR_LABEL[sector], SECCION_LABEL[seccion]],
          tecnologias: TECNOLOGIAS_POR_TEMATICA[tematica].slice(0, 4),
          descriptores: DESCRIPTORES_POR_SECTOR[sector].slice(0, 4),
        })

        offset += 1
      }
    }
  }

  return posts
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🔄 RESET POSTS — Observatorio CETEC`)
  console.log(`   Proyecto: ${projectId}`)
  console.log(`   Dataset:  ${dataset}`)
  if (dryRun) console.log(`   Modo:     DRY-RUN (no se escribe nada)\n`)
  else console.log()

  // Verificar conexión
  try {
    await client.fetch('*[false]')
    console.log('✓ Conexión con Sanity OK')
  } catch (err) {
    console.error('✗ No se puede conectar con Sanity:', err.message)
    process.exit(1)
  }

  // ── 1. Borrar todos los posts ─────────────────────────────────────────────
  const existingIds = await client.fetch(`*[_type == "post"]._id`)
  console.log(`\n📦 Posts existentes: ${existingIds.length}`)

  if (existingIds.length > 0 && !dryRun) {
    console.log('   Borrando…')
    let deleted = 0
    // En lotes de 50 para no saturar
    for (let i = 0; i < existingIds.length; i += 50) {
      const batch = existingIds.slice(i, i + 50)
      const tx = client.transaction()
      for (const id of batch) tx.delete(id)
      try {
        await tx.commit({ visibility: 'async' })
        deleted += batch.length
        process.stdout.write(`\r   ${deleted}/${existingIds.length} borrados`)
      } catch (err) {
        console.error(`\n   ✗ Error borrando lote: ${err.message}`)
      }
    }
    console.log(`\n   ✓ ${deleted} posts borrados`)
  } else if (existingIds.length > 0) {
    console.log(`   (dry-run: no se borran)`)
  }

  // ── 2. Crear posts nuevos ─────────────────────────────────────────────────
  const posts = buildPosts()
  console.log(`\n📝 Insertando ${posts.length} posts nuevos…`)

  if (dryRun) {
    console.log(`   (dry-run: no se insertan)`)
    console.log(`\n   Resumen de lo que se crearía:`)
    const counts = {}
    for (const p of posts) {
      counts[p.seccion] = (counts[p.seccion] || 0) + 1
    }
    for (const [s, c] of Object.entries(counts)) {
      console.log(`     • ${SECCION_LABEL[s]}: ${c}`)
    }
    return
  }

  let created = 0
  for (const post of posts) {
    try {
      await client.create(post)
      created++
      process.stdout.write(`\r   ${created}/${posts.length} creados`)
    } catch (err) {
      console.error(`\n   ✗ Error en "${post.title}": ${err.message}`)
    }
  }
  console.log(`\n   ✓ ${created} posts creados`)

  // ── Resumen ──────────────────────────────────────────────────────────────
  console.log('\n─────────────────────────────────────────')
  console.log('✅ Reset completado')
  console.log(`   • ${SECCIONES.length} secciones × ${TEMATICAS.length} temáticas × ${SECTORES.length} sectores = ${posts.length} posts`)
  console.log(`   • Cada post incluye: título, slug, sección, temática, sector, fecha,`)
  console.log(`     extracto, cuerpo (3 párrafos), tags, tecnologías y descriptores.`)
  console.log(`   • La página de detalle se renderiza completa (sidebar incluido).`)
  console.log('─────────────────────────────────────────\n')
}

main().catch((err) => {
  console.error('Error fatal:', err)
  process.exit(1)
})
