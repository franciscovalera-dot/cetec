/**
 * Badge/etiqueta de categoría con color dinámico
 * El color viene del CMS (Sanity)
 */
interface CategoryBadgeProps {
  name: string
  color?: string
  small?: boolean
}

export default function CategoryBadge({
  name,
  color = '#6B7280',
  small = false,
}: CategoryBadgeProps) {
  return (
    <span
      className={`inline-block font-semibold uppercase tracking-wide rounded-full ${
        small ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'
      }`}
      style={{
        color: color,
        backgroundColor: `${color}15`, // Color con 15% de opacidad
        border: `1px solid ${color}30`,
      }}
    >
      {name}
    </span>
  )
}
