'use client'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/apiClient'

export default function AdminApiBalancePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin','api-balance'],
    queryFn: async () => (await api.get('/admin/api-balance')).data,
  })

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">API Balance</h2>
      {isLoading ? 'Loading...' : error ? 'Failed to load' : (
        <div className="text-2xl font-semibold">{data?.balance ?? 'N/A'}</div>
      )}
    </div>
  )
}
