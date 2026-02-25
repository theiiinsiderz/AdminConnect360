type VehicleOwnerCardProps = {
  vehicleType: 'Car' | 'Bike'
  vehicleNumber: string
  ownerName: string
  ownerPhone: string
}

export default function VehicleOwnerCard({ vehicleType, vehicleNumber, ownerName, ownerPhone }: VehicleOwnerCardProps) {
  return (
    <article className="premium-card min-w-0 overflow-hidden px-3 py-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="premium-chip px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-amber-100/85">{vehicleType}</span>
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">Owner</p>
      </div>

      <div className="mt-2.5 space-y-2 text-sm">
        <div className="flex min-w-0 items-center gap-2 rounded-lg border border-amber-100/10 bg-zinc-900/55 px-2.5 py-2">
          <p className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-zinc-400">Number</p>
          <p className="min-w-0 truncate text-sm font-semibold text-amber-50">{vehicleNumber}</p>
        </div>

        <div className="flex min-w-0 items-center gap-2 rounded-lg border border-amber-100/10 bg-zinc-900/55 px-2.5 py-2">
          <p className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-zinc-400">Name</p>
          <p className="min-w-0 truncate text-sm font-medium text-zinc-100">{ownerName}</p>
        </div>

        <div className="flex min-w-0 items-center gap-2 rounded-lg border border-amber-100/10 bg-zinc-900/55 px-2.5 py-2">
          <p className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-zinc-400">Phone</p>
          <p className="min-w-0 truncate text-sm font-medium text-zinc-100">{ownerPhone}</p>
        </div>
      </div>
    </article>
  )
}