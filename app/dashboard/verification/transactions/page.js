export default function VerificationTransactionsPage() {
  const items = []
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Verification Transactions</h2>
      {items.length === 0 ? (
        <div className="text-neutral-300">No verification transactions yet.</div>
      ) : (
        <ul>
          {items.map(i => <li key={i.id}>{i.id}</li>)}
        </ul>
      )}
    </div>
  )
}
