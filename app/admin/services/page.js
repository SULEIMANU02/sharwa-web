'use client'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/apiClient'
import Link from 'next/link'

export default function AdminServicesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin','services'],
    queryFn: async () => (await api.get('/admin/services')).data,
  })

  if (isLoading) return <div className="card">Loading services...</div>
  if (error) return <div className="card">Failed to load services</div>

  const items = data?.services || []
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Services</h2>
      <ul className="list-disc list-inside">
        {items.map(s => (
          <li key={s.id}>
            <Link className="underline" href={`/admin/services/${s.id}`}>{s.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
