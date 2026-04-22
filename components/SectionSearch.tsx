/**
 * Buscador reutilizable para páginas de listado (noticias, agenda, etc.)
 * Form GET que envía `q` y `date` preservando los filtros existentes.
 */
interface SectionSearchProps {
  basePath: string
  q?: string
  date?: string
  hiddenParams?: Record<string, string | undefined>
  placeholder?: string
}

const DATE_OPTIONS = [
  { value: '', label: 'Fecha' },
  { value: '1m', label: 'Último mes' },
  { value: '3m', label: 'Últimos 3 meses' },
  { value: '6m', label: 'Últimos 6 meses' },
  { value: '1y', label: 'Último año' },
]

export default function SectionSearch({
  basePath,
  q,
  date,
  hiddenParams = {},
  placeholder = 'Busca por texto...',
}: SectionSearchProps) {
  return (
    <form action={basePath} method="GET" className="mb-8">
      {Object.entries(hiddenParams).map(([key, value]) =>
        value ? <input key={key} type="hidden" name={key} value={value} /> : null
      )}
      <div className="flex items-stretch border border-[#DFDFDF] rounded-md overflow-hidden shadow-sm" style={{ backgroundColor: '#F9F9F8' }}>
        <input
          type="text"
          name="q"
          defaultValue={q || ''}
          placeholder={placeholder}
          className="flex-1 px-4 py-5 text-sm focus:outline-none text-gray-800 placeholder-gray-400 min-w-0"
          style={{ backgroundColor: '#F9F9F8' }}
        />

        {/* Separador */}
        <div className="w-px bg-gray-200 self-stretch" />

        {/* Select de fecha */}
        <div className="relative w-44 flex-shrink-0 flex items-center">
          <select
            name="date"
            defaultValue={date || ''}
            className="w-full pl-4 pr-8 py-5 text-sm focus:outline-none cursor-pointer border-none appearance-none text-gray-500"
            style={{ backgroundColor: '#F9F9F8' }}
          >
            {DATE_OPTIONS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
          <svg className="absolute right-3 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <button
          type="submit"
          className="px-6 py-5 bg-black hover:bg-gray-700 text-white text-sm transition-colors whitespace-nowrap flex-shrink-0"
        >
          Buscar
        </button>
      </div>
    </form>
  )
}
