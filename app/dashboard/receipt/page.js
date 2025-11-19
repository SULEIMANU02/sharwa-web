'use client'
import { useSearchParams } from 'next/navigation'

export default function ReceiptPage() {
  const params = useSearchParams()
  const id = params.get('id')
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Receipt</h2>
      <div className="text-neutral-300">Transaction ID: {id || 'N/A'}</div>
    </div>
  )
}
