'use client'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import api from '@/lib/apiClient'

export default function CablePage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()
  const [message, setMessage] = useState('')

  const onSubmit = async (data) => {
    setMessage('')
    try {
      await api.post('/cable/purchase', data)
      setMessage('Cable subscription successful')
    } catch (e) {
      setMessage(e?.response?.data?.message || 'Cable purchase failed')
    }
  }

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-4">Cable TV</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block mb-1">Provider</label>
          <select className="input" {...register('provider', { required: true })}>
            <option value="dstv">DSTV</option>
            <option value="gotv">GOTV</option>
            <option value="startimes">Startimes</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Smart Card Number</label>
          <input className="input" {...register('card', { required: true })} />
        </div>
        <div>
          <label className="block mb-1">Package</label>
          <input className="input" {...register('package', { required: true })} />
        </div>
        <button disabled={isSubmitting} className="btn-primary w-full">{isSubmitting ? 'Processing...' : 'Subscribe'}</button>
        {message && <div className="text-sm text-neutral-300">{message}</div>}
      </form>
    </div>
  )
}
