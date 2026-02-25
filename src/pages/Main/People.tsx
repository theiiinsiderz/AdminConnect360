export default function People() {
  return (
    <article className="premium-card p-6 md:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">Directory</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-amber-50">People</h3>
          <p className="mt-3 max-w-2xl text-sm text-zinc-300">
            People page is ready. Add your people management table, profile actions, and role controls here.
          </p>
        </div>
        <span className="premium-chip px-4 py-2 text-xs text-amber-100/85">Workspace</span>
      </div>
    </article>
  )
}
