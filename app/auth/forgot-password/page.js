'use client'
import { useForm } from 'react-hook-form'
import api from '@/lib/apiClient'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()
  const [message, setMessage] = useState('')
  const onSubmit = async (data) => {
    setMessage('')
    try {
      await api.post('/auth/forgot-password', data)
      setMessage('Check your email for reset instructions.')
    } catch (e) {
      setMessage(e?.response?.data?.message || 'Request failed')
    }
  }
  return (
    <main className="container py-10 max-w-md">
      <h1 className="text-2xl font-semibold mb-6">Forgot Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block mb-1">Email</label>
          <input className="input" type="email" {...register('email', { required: true })} />
        </div>
        <button disabled={isSubmitting} className="btn-primary w-full">{isSubmitting ? 'Submitting...' : 'Submit'}</button>
        {message && <div className="text-sm text-neutral-300">{message}</div>}
      </form>
    </main>
  )
}
