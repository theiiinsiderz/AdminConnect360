const statCards = [
  { label: 'Total Bike Users', value: '2,148', change: '+6.2%', completion: 76 },
  { label: 'Total Car Users', value: '1,287', change: '+4.1%', completion: 64 },
  { label: 'People Added', value: '356', change: '+9.8%', completion: 83 },
]

export default function Overview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((card) => (
          <article key={card.label} className="premium-card p-5">
            <p className="text-sm text-zinc-400">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-amber-50">{card.value}</p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-800/80">
              <div
                className="h-full rounded-full bg-linear-to-r from-amber-300 to-yellow-500"
                style={{ width: `${card.completion}%` }}
              />
            </div>
            <p className="mt-3 text-xs font-medium text-emerald-300">{card.change} this month</p>
          </article>
        ))}
      </div>

      <article className="premium-card p-6">
        <h3 className="text-lg font-semibold text-amber-50">Recent Activity</h3>
        <ul className="mt-4 space-y-3 text-sm text-zinc-300">
          <li className="premium-chip px-4 py-3">12 new bike users onboarded in the last 24 hours.</li>
          <li className="premium-chip px-4 py-3">7 new car users verified successfully.</li>
          <li className="premium-chip px-4 py-3">5 people profiles updated by admins today.</li>
        </ul>
      </article>
    </div>
  )
}
