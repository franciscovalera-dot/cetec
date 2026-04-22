// Schema para mensajes del formulario de contacto público
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactMessage',
  title: 'Mensaje de contacto',
  type: 'document',
  fields: [
    defineField({ name: 'nombre',    title: 'Nombre',    type: 'string' }),
    defineField({ name: 'apellidos', title: 'Apellidos', type: 'string' }),
    defineField({ name: 'empresa',   title: 'Empresa',   type: 'string' }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({ name: 'telefono', title: 'Teléfono', type: 'string' }),
    defineField({ name: 'asunto',   title: 'Asunto',   type: 'string' }),
    defineField({
      name: 'mensaje',
      title: 'Mensaje',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'createdAt',
      title: 'Fecha',
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
    select: { email: 'email', asunto: 'asunto', nombre: 'nombre' },
    prepare({ email, asunto, nombre }) {
      return {
        title: asunto || '(sin asunto)',
        subtitle: `${nombre || '—'} · ${email || ''}`,
      }
    },
  },
})
