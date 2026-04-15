/**
 * Configuración principal de Sanity Studio v3
 * Se monta en /studio dentro de la app Next.js
 */
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

// Variables de entorno del proyecto Sanity
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'tu-project-id'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  // Ruta base donde se monta el Studio
  basePath: '/studio',

  // Credenciales del proyecto
  projectId,
  dataset,

  // Plugins activos
  plugins: [
    // Herramienta de estructura para navegar documentos
    structureTool(),
    // Vision: consola GROQ para hacer queries de prueba
    visionTool({ defaultApiVersion: '2024-01-01' }),
  ],

  // Registrar todos los schemas definidos
  schema: {
    types: schemaTypes,
  },
})
