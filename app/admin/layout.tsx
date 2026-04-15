import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Panel de Administración — Observatorio CETEC',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-gray-100 min-h-screen">
      {children}
    </div>
  )
}
