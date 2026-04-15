// Schema para artículos/noticias del blog científico
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Artículo',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required().min(10).max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seccion',
      title: 'Sección principal',
      type: 'string',
      description: 'Determina en qué página aparece la entrada',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Noticias', value: 'noticias' },
          { title: 'Normativa y Legislación', value: 'normativa' },
          { title: 'Formación y Cursos', value: 'formacion' },
          { title: 'Ayudas y Subvenciones', value: 'ayudas' },
          { title: 'Agenda / Eventos', value: 'agenda' },
          { title: 'MarketTech', value: 'markettech' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'tematica',
      title: 'Temática',
      type: 'string',
      description: 'Subcategoría temática para filtrar dentro de la sección',
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
      description: 'Sector industrial al que pertenece',
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
      title: 'Categoría (legacy)',
      type: 'reference',
      to: [{ type: 'category' }],
      hidden: true,
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Imagen principal',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Extracto',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(250),
    }),
    defineField({
      name: 'body',
      title: 'Contenido',
      type: 'blockContent',
    }),
    defineField({
      name: 'tags',
      title: 'Etiquetas',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
  ],
  // Vista previa en el panel de Sanity Studio
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'image',
    },
    prepare({ title, author, media }) {
      return {
        title,
        subtitle: author ? `por ${author}` : '',
        media,
      }
    },
  },
  // Ordenar por fecha de publicación descendente
  orderings: [
    {
      title: 'Fecha de publicación (reciente)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
})
