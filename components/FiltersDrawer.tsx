'use client'

import { useState } from 'react'

interface Props {
  query?: string
  tematica?: string
  sector?: string
  dateFrom?: string
  dateTo?: string
  idioma?: string
}

const IDIOMAS = [
  { value: '', label: 'Todos' },
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
]

/**
 * Drawer de filtros para móvil/tablet (< lg).
 * Los mismos campos que el sidebar (rango de fechas + idioma) ocultos
 * tras un botón "Filtros" para no perder funcionalidad en viewports estrechos.
 */
export default function FiltersDrawer({ query, tematica, sector, dateFrom, dateTo, idioma }: Props) {
  const [open, setOpen] = useState(false)

  const activeCount =
    (dateFrom ? 1 : 0) + (dateTo ? 1 : 0) + (idioma ? 1 : 0)

  return (
    <>
      {/* Botón Filtros — visible sólo en < lg */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors mb-4"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filtros
        {activeCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] text-white bg-orange-500 rounded-full">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full p-6 shadow-xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg text-gray-900">Filtros</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                aria-label="Cerrar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form action="/busqueda" method="GET" className="space-y-5">
              {/* Preservar filtros de la barra superior */}
              {query    && <input type="hidden" name="q"        value={query} />}
              {tematica && <input type="hidden" name="tematica" value={tematica} />}
              {sector   && <input type="hidden" name="sector"   value={sector} />}

              {/* Incorporado entre */}
              <div>
                <label className="text-sm text-gray-700 block mb-2">Incorporado entre</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    name="dateFrom"
                    defaultValue={dateFrom || ''}
                    className="w-0 flex-1 min-w-0 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 bg-white"
                  />
                  <input
                    type="date"
                    name="dateTo"
                    defaultValue={dateTo || ''}
                    className="w-0 flex-1 min-w-0 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 bg-white"
                  />
                </div>
              </div>

              {/* Idioma */}
              <div>
                <label className="text-sm text-gray-700 block mb-2">Idioma</label>
                <select
                  name="idioma"
                  defaultValue={idioma || ''}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 cursor-pointer bg-white"
                >
                  {IDIOMAS.map((i) => (
                    <option key={i.value} value={i.value}>{i.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                {activeCount > 0 && (
                  <a
                    href={`/busqueda${query || tematica || sector ? '?' + new URLSearchParams({
                      ...(query    && { q: query }),
                      ...(tematica && { tematica }),
                      ...(sector   && { sector }),
                    }).toString() : ''}`}
                    className="flex-1 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
                  >
                    Limpiar
                  </a>
                )}
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-black hover:bg-gray-800 text-white text-sm rounded-lg transition-colors"
                >
                  Aplicar filtros
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
