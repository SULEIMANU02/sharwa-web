'use client'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import api from '@/lib/apiClient'

export default function AdminApiSettingsPage() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()

  useEffect(() => {
    (async () => {
      const res = await api.get('/admin/apisettings')
      reset(res.data)
    })()
  }, [reset])

  const onSubmit = async (data) => {
    await api.post('/admin/apisettings', data)
    alert('Saved')
  }

  return (
    <div className="card max-w-xl">
      <h2 className="text-xl font-semibold mb-4">API Settings</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block mb-1">API Key</label>
          <input className="input" {...register('apiKey')} />
        </div>
        <div>
          <label className="block mb-1">Base URL</label>
          <input className="input" {...register('baseUrl')} />
        </div>
        <button disabled={isSubmitting} className="btn-primary">Save</button>
      </form>
    </div>
  )
}
