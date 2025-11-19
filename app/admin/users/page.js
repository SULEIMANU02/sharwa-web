'use client'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/apiClient'

export default function AdminUsersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin','users'],
    queryFn: async () => (await api.get('/admin/users')).data,
  })

  if (isLoading) return <div className="card">Loading users...</div>
  if (error) return <div className="card">Failed to load users</div>

  const users = data?.users || []
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-400">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t border-neutral-800">
                <td className="py-2">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
