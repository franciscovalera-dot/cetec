import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
  queryParams?: Record<string, string>
}

export default function Pagination({ currentPage, totalPages, basePath, queryParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null

  function buildHref(page: number) {
    const params = { ...queryParams }
    if (page > 1) params.page = String(page)
    const qs = Object.entries(params)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&')
    return qs ? `${basePath}?${qs}` : basePath
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-14">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          className={`w-10 h-10 rounded-full text-sm font-medium flex items-center justify-center transition-colors ${
            p === currentPage
              ? 'bg-orange-500 text-white'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          {p}
        </Link>
      ))}
    </div>
  )
}
