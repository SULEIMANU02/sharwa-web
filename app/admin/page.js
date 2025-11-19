export default function AdminDashboard() {
  const cards = [
    { label: 'Total Users', value: '0' },
    { label: 'Transactions Today', value: '0' },
    { label: 'Revenue', value: '₦0' },
  ]
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="card">
          <div className="text-neutral-400 text-sm">{c.label}</div>
          <div className="text-2xl font-semibold">{c.value}</div>
        </div>
      ))}
    </div>
  )
}
