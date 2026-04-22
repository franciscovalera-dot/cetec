// Índice de todos los schemas de Sanity
import post from './post'
import category from './category'
import author from './author'
import agenda from './agenda'
import document from './document'
import glossary from './glossary'
import blockContent from './blockContent'
import solucion from './solucion'
import subscription from './subscription'

// Exportar todos los schemas para usar en sanity.config.ts
export const schemaTypes = [
  post,
  category,
  author,
  agenda,
  document,
  glossary,
  blockContent,
  solucion,
  subscription,
]
