// Schema para documentos descargables (PDFs, informes, etc.)
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'document',
  title: 'Documento',
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
      name: 'tipoDocumento',
      title: 'Tipo de documento',
      type: 'string',
      description: 'Clasificación del documento',
      options: {
        list: [
          { title: 'Artículo técnico', value: 'articulo-tecnico' },
          { title: 'Boletín de vigilancia', value: 'boletin-vigilancia' },
          { title: 'Guía de buenas prácticas', value: 'guia-buenas-practicas' },
          { title: 'Informe de Estado del Arte', value: 'informe-estado-arte' },
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
      name: 'file',
      title: 'Archivo',
      type: 'file',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categoría (legacy)',
      type: 'reference',
      to: [{ type: 'category' }],
      hidden: true,
    }),
    defineField({
      name: 'date',
      title: 'Fecha de publicación',
      type: 'datetime',
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'fileType',
      title: 'Tipo de archivo',
      type: 'string',
      options: {
        list: [
          { title: 'PDF', value: 'pdf' },
          { title: 'Word', value: 'docx' },
          { title: 'Excel', value: 'xlsx' },
          { title: 'Otro', value: 'other' },
        ],
      },
    }),
  ],
  preview: {
    select: { title: 'title', fileType: 'fileType' },
    prepare({ title, fileType }) {
      return {
        title,
        subtitle: fileType ? fileType.toUpperCase() : 'Documento',
      }
    },
  },
})
