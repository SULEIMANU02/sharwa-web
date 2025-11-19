'use client'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import api from '@/lib/apiClient'

export default function NepaPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()
  const [message, setMessage] = useState('')

  const onSubmit = async (data) => {
    setMessage('')
    try {
      await api.post('/nepa/pay', data)
      setMessage('NEPA payment successful')
    } catch (e) {
      setMessage(e?.response?.data?.message || 'NEPA payment failed')
    }
  }

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-4">NEPA</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block mb-1">Disco</label>
          <select className="input" {...register('disco', { required: true })}>
            <option value="ikeja">Ikeja</option>
            <option value="eko">Eko</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Meter Number</label>
          <input className="input" {...register('meter', { required: true })} />
        </div>
        <div>
          <label className="block mb-1">Amount (₦)</label>
          <input className="input" type="number" min="100" step="50" {...register('amount', { required: true, min: 100 })} />
        </div>
        <button disabled={isSubmitting} className="btn-primary w-full">{isSubmitting ? 'Processing...' : 'Pay'}</button>
        {message && <div className="text-sm text-neutral-300">{message}</div>}
      </form>
    </div>
  )
}
