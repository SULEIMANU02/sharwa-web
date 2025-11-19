import AuthGuard from '@/components/AuthGuard'
import AdminSidebar from '@/components/Layout/AdminSidebar'

export const metadata = { title: 'Admin' }

export default function AdminLayout({ children }) {
  return (
    <AuthGuard role="admin">
      <div className="container py-6 grid md:grid-cols-[240px,1fr] gap-4">
        <AdminSidebar />
        <div>
          {children}
        </div>
      </div>
    </AuthGuard>
  )
}
