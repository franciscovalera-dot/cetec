// Schema para suscripciones del newsletter y alertas de búsqueda
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'subscription',
  title: 'Suscripción',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'type',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          { title: 'Newsletter general', value: 'general' },
          { title: 'Alerta de búsqueda', value: 'search-alert' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    // Campos de filtro (sólo se rellenan cuando type === 'search-alert')
    defineField({ name: 'query',    title: 'Texto buscado', type: 'string' }),
    defineField({ name: 'seccion',  title: 'Sección',       type: 'string' }),
    defineField({ name: 'tematica', title: 'Temática',      type: 'string' }),
    defineField({ name: 'sector',   title: 'Sector',        type: 'string' }),
    defineField({ name: 'idioma',   title: 'Idioma',        type: 'string' }),
    defineField({
      name: 'createdAt',
      title: 'Fecha de creación',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Más recientes primero',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { email: 'email', type: 'type', query: 'query' },
    prepare({ email, type, query }) {
      return {
        title: email,
        subtitle: type === 'search-alert' ? `Alerta: ${query || '—'}` : 'Newsletter general',
      }
    },
  },
})
