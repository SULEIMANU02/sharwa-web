'use client'
import { useForm } from 'react-hook-form'
import api from '@/lib/apiClient'
import { useState } from 'react'

export default function NinVerifyPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()
  const [message, setMessage] = useState('')
  const onSubmit = async (data) => {
    setMessage('')
    try {
      await api.post('/verify/nin', data)
      setMessage('NIN verification successful')
    } catch (e) {
      setMessage(e?.response?.data?.message || 'NIN verification failed')
    }
  }
  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-4">NIN Verification</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block mb-1">NIN</label>
          <input className="input" {...register('nin', { required: true })} />
        </div>
        <button disabled={isSubmitting} className="btn-primary w-full">{isSubmitting ? 'Verifying...' : 'Verify'}</button>
        {message && <div className="text-sm text-neutral-300">{message}</div>}
      </form>
    </div>
  )
}
