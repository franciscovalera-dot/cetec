// Schema para eventos de la agenda científica
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'agenda',
  title: 'Evento de Agenda',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título del evento',
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
      name: 'date',
      title: 'Fecha y hora',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Fecha de finalización',
      type: 'datetime',
    }),
    defineField({
      name: 'location',
      title: 'Ubicación',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'blockContent',
    }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'link',
      title: 'Enlace externo',
      type: 'url',
    }),
  ],
  orderings: [
    {
      title: 'Fecha (próximo)',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', date: 'date', location: 'location' },
    prepare({ title, date, location }) {
      return {
        title,
        subtitle: `${date ? new Date(date).toLocaleDateString('es-ES') : ''} — ${location || ''}`,
      }
    },
  },
})
