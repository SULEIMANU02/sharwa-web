'use client'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/apiClient'

export default function AdminTransactionsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin','transactions'],
    queryFn: async () => (await api.get('/admin/transactions')).data,
  })

  if (isLoading) return <div className="card">Loading transactions...</div>
  if (error) return <div className="card">Failed to load transactions</div>

  const txs = data?.transactions || []
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Transactions</h2>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-400">
              <th className="py-2">ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {txs.map(t => (
              <tr key={t.id} className="border-t border-neutral-800">
                <td className="py-2">{t.id}</td>
                <td>{t.type}</td>
                <td>{t.amount}</td>
                <td>{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
