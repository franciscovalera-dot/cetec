/**
 * Layout para Sanity Studio
 * Sin Header ni Footer — el Studio tiene su propio chrome
 */
export const metadata = {
  title: 'Sanity Studio — Blog Científico',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
