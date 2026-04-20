// Schema para soluciones tecnológicas de MarketTech
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'solucion',
  title: 'Solución tecnológica',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Contenido',
      type: 'blockContent',
    }),
    defineField({
      name: 'body',
      title: 'Contenido detallado',
      type: 'blockContent',
    }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Texto alternativo', type: 'string' }),
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
    }),
    defineField({
      name: 'numero',
      title: 'Número / Referencia',
      type: 'string',
    }),
    defineField({
      name: 'solicitante',
      title: 'Solicitante',
      type: 'string',
    }),
    defineField({
      name: 'inventor',
      title: 'Inventor',
      type: 'string',
    }),
    defineField({
      name: 'fuente',
      title: 'Fuente',
      type: 'string',
    }),
    defineField({
      name: 'tecnologia',
      title: 'Tecnología habilitadora',
      type: 'string',
      options: {
        list: [
          { title: 'Tecnologías verdes', value: 'tecnologias-verdes' },
          { title: 'Tecnologías digitales', value: 'tecnologias-digitales' },
          { title: 'Nanotecnología', value: 'nanotecnologia' },
          { title: 'Fabricación avanzada', value: 'fabricacion-avanzada' },
          { title: 'Materiales avanzados', value: 'materiales-avanzados' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'sector',
      title: 'Sector de aplicación',
      type: 'string',
      options: {
        list: [
          { title: 'Plástico', value: 'plastico' },
          { title: 'Calzado', value: 'calzado' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'reto',
      title: 'Reto que soluciona',
      type: 'string',
      options: {
        list: [
          { title: 'Reducción de residuos', value: 'reduccion-residuos' },
          { title: 'Ahorro energético', value: 'ahorro-energetico' },
          { title: 'Calidad de materiales reciclados', value: 'calidad-reciclados' },
          { title: 'Mejora de la reciclabilidad', value: 'mejora-reciclabilidad' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'material',
      title: 'Tipo de material',
      type: 'string',
      options: {
        list: [
          { title: 'Bioplásticos', value: 'bioplasticos' },
          { title: 'Polímeros', value: 'polimeros' },
        ],
        layout: 'dropdown',
      },
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'tecnologia' },
  },
  orderings: [
    {
      title: 'Título (A-Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
