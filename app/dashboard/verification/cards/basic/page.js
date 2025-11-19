
'use client'
import { useForm } from 'react-hook-form'
import api from '@/lib/apiClient'
import { useState } from 'react'

export default function CardBasicPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()
  const [message, setMessage] = useState('')
  const onSubmit = async (data) => {
    setMessage('')
    try {
      await api.post('/verify/card/basic', data)
      setMessage('Basic card verification submitted')
    } catch (e) {
      setMessage(e?.response?.data?.message || 'Verification failed')
    }
  }
  return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold mb-4">Card Verification - Basic</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block mb-1">Card Number</label>
          <input className="input" {...register('card', { required: true })} />
        </div>
        <button disabled={isSubmitting} className="btn-primary w-full">{isSubmitting ? 'Submitting...' : 'Submit'}</button>
        {message && <div className="text-sm text-neutral-300">{message}</div>}
      </form>
    </div>
  )
}
