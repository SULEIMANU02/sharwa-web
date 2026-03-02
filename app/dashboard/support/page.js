'use client'

export default function SupportPage() {
  const phone = '+2348104891559'
  const whatsappUrl = `https://wa.me/${phone.replace('+', '')}`
  const callUrl = `tel:${phone}`

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-1">Contact Us</h1>
        <p className="text-gray-600">Reach support through WhatsApp chat or phone call.</p>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="block bg-white border border-gray-200 rounded-2xl p-6 hover:border-green-500 transition-colors"
      >
        <p className="font-semibold text-gray-900">Chat us on WhatsApp</p>
        <p className="text-sm text-gray-500">{phone}</p>
      </a>

      <a
        href={callUrl}
        className="block bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-500 transition-colors"
      >
        <p className="font-semibold text-gray-900">Call us</p>
        <p className="text-sm text-gray-500">{phone}</p>
      </a>
    </div>
  )
}
