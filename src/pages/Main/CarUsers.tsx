import VehicleOwnerCard from '../../components/VehicleOwnerCard'

const carUsers = [
  { vehicleNumber: 'TN 09 AZ 9001', ownerName: 'Arun Prakash', ownerPhone: '+91 93456 77720' },
  { vehicleNumber: 'TN 14 MX 2748', ownerName: 'Divya Shah', ownerPhone: '+91 90030 61238' },
]

export default function CarUsers() {
  return (
    <section className="space-y-5">
      <article className="premium-card p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">Management</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-amber-50">Car Users</h3>
            <p className="mt-3 max-w-2xl text-sm text-zinc-300">Car number, owner name, and owner phone are shown below.</p>
          </div>
          <span className="premium-chip px-4 py-2 text-xs text-amber-100/85">Collection</span>
        </div>
      </article>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {carUsers.map((item) => (
          <VehicleOwnerCard
            key={item.vehicleNumber}
            vehicleType="Car"
            vehicleNumber={item.vehicleNumber}
            ownerName={item.ownerName}
            ownerPhone={item.ownerPhone}
          />
        ))}
      </div>
    </section>
  )
}
