import React from 'react'
import './admin-layout.css'

type AdminLayoutProps = {
  children?: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <main className="admin-layout">
      <div className="admin-layout__container">{children}</div>
    </main>
  )
}

export default AdminLayout
