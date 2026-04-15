// Schema para contenido enriquecido (Portable Text)
// Usado en el cuerpo de artículos, descripciones de agenda, etc.
import { defineType, defineArrayMember } from 'sanity'

export default defineType({
  name: 'blockContent',
  title: 'Contenido',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      title: 'Bloque de texto',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Cita', value: 'blockquote' },
      ],
      lists: [
        { title: 'Viñetas', value: 'bullet' },
        { title: 'Numeración', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Negrita', value: 'strong' },
          { title: 'Cursiva', value: 'em' },
          { title: 'Subrayado', value: 'underline' },
          { title: 'Código', value: 'code' },
        ],
        annotations: [
          {
            title: 'Enlace',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
              {
                title: 'Abrir en nueva pestaña',
                name: 'blank',
                type: 'boolean',
              },
            ],
          },
        ],
      },
    }),
    // Permitir imágenes dentro del contenido
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
        },
        {
          name: 'caption',
          title: 'Pie de imagen',
          type: 'string',
        },
      ],
    }),
  ],
})
