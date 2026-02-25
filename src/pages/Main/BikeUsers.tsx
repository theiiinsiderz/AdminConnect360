import VehicleOwnerCard from '../../components/VehicleOwnerCard'

const bikeUsers = [
  { vehicleNumber: 'TN 10 BK 4521', ownerName: 'Ravi Kumar', ownerPhone: '+91 98765 12340' },
  { vehicleNumber: 'TN 22 CE 7813', ownerName: 'Priya Nair', ownerPhone: '+91 91234 88776' },
]

export default function BikeUsers() {
  return (
    <section className="space-y-5">
      <article className="premium-card p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">Management</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-amber-50">Bike Users</h3>
            <p className="mt-3 max-w-2xl text-sm text-zinc-300">Bike number, owner name, and owner phone are shown below.</p>
          </div>
          <span className="premium-chip px-4 py-2 text-xs text-amber-100/85">Collection</span>
        </div>
      </article>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {bikeUsers.map((item) => (
          <VehicleOwnerCard
            key={item.vehicleNumber}
            vehicleType="Bike"
            vehicleNumber={item.vehicleNumber}
            ownerName={item.ownerName}
            ownerPhone={item.ownerPhone}
          />
        ))}
      </div>
    </section>
  )
}
