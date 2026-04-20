// Schema para términos del glosario científico
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'glossary',
  title: 'Término del Glosario',
  type: 'document',
  fields: [
    defineField({
      name: 'term',
      title: 'Término',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'term', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'definition',
      title: 'Definición',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tematica',
      title: 'Temática',
      type: 'string',
      options: {
        list: [
          { title: 'Materiales', value: 'materiales' },
          { title: 'Procesos', value: 'procesos' },
          { title: 'Digitalización', value: 'digitalizacion' },
          { title: 'Reciclado', value: 'reciclado' },
          { title: 'Ecodiseño', value: 'ecodiseno' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'sector',
      title: 'Sector',
      type: 'string',
      options: {
        list: [
          { title: 'Plástico', value: 'plastico' },
          { title: 'Calzado', value: 'calzado' },
          { title: 'Agroalimentario', value: 'agroalimentario' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'relatedTerms',
      title: 'Términos relacionados',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'glossary' }] }],
    }),
  ],
  orderings: [
    {
      title: 'Alfabético (A-Z)',
      name: 'termAsc',
      by: [{ field: 'term', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'term', category: 'category.name' },
    prepare({ title, category }) {
      return { title, subtitle: category || '' }
    },
  },
})
