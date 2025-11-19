export default function UpgradePage() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {['Basic','Standard','Premium'].map((tier) => (
        <div key={tier} className="card">
          <h3 className="text-lg font-semibold mb-2">{tier}</h3>
          <p className="text-neutral-300 text-sm mb-3">Upgrade to {tier} for more benefits.</p>
          <button className="btn-primary">Choose {tier}</button>
        </div>
      ))}
    </div>
  )
}
