'use client'
import { storage } from '@/lib/storage'

export default function ProfilePage() {
  const session = storage.get('session') || { user: {} }
  const { user } = session
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      <div className="space-y-2 text-neutral-300">
        <div>Name: {user?.name || '-'}</div>
        <div>Email: {user?.email || '-'}</div>
        <div>Role: {user?.role || '-'}</div>
      </div>
    </div>
  )
}
