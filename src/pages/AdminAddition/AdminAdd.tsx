import { useState } from 'react'
import api from '../../services/api'

type ApiMessage = {
	message?: string
}

export default function AdminAdd() {
	const [phone, setPhone] = useState('')
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [success, setSuccess] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	const phoneDigits = phone.replace(/\D/g, '').slice(0, 10)
	const isPhoneValid = phoneDigits.length === 10

	const handleSubmit = async () => {
		if (!isPhoneValid) {
			setError('Enter a valid 10-digit phone number.')
			setSuccess(null)
			return
		}

		setIsSubmitting(true)
		setError(null)
		setSuccess(null)

		try {
			const response = await api.post('/admin/add-admin', {
				phoneNumber: phoneDigits,
				name: name.trim() || undefined,
				email: email.trim() || undefined,
			})

			setSuccess(response.data?.message || 'Admin updated successfully.')
			setPhone('')
			setName('')
			setEmail('')
		} catch (err: any) {
			const message = (err?.response?.data as ApiMessage)?.message || 'Failed to add admin. Please try again.'
			setError(message)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<article className="premium-card p-6 md:p-7">
			<div className="flex flex-col gap-6">
				<div className="flex items-start justify-between gap-4">
					<div>
						<p className="text-xs uppercase tracking-[0.24em] text-amber-200/70">Administration</p>
						<h3 className="mt-2 text-2xl font-semibold tracking-tight text-amber-50">Add Another Admin</h3>
						<p className="mt-3 max-w-2xl text-sm text-zinc-300">
							Create a new admin or promote an existing user by phone number.
						</p>
					</div>
					<span className={`premium-chip px-4 py-2 text-xs ${isSubmitting ? 'text-amber-300 animate-pulse' : 'text-amber-100/85'}`}>
						{isSubmitting ? 'Submitting...' : 'Ready'}
					</span>
				</div>

				<div className="grid max-w-md gap-5">
					<label className="block space-y-2">
						<span className="text-xs font-medium uppercase tracking-[0.22em] text-amber-100/80">Phone Number</span>
						<div className="flex items-center rounded-xl border border-amber-100/20 bg-black/40 px-4">
							<span className="pr-2 text-amber-100/70">+91</span>
							<input
								type="tel"
								inputMode="numeric"
								autoComplete="tel"
								value={phoneDigits}
								onChange={(event) => {
									setPhone(event.target.value)
									setError(null)
								}}
								placeholder="9876543210"
								className="w-full border-0 bg-transparent py-3 text-base tracking-wide text-amber-50 placeholder:text-amber-50/35 focus:outline-none"
							/>
						</div>
					</label>

					<label className="block space-y-2">
						<span className="text-xs font-medium uppercase tracking-[0.22em] text-amber-100/80">Name (Optional)</span>
						<input
							type="text"
							value={name}
							onChange={(event) => {
								setName(event.target.value)
								setError(null)
							}}
							placeholder="Admin name"
							className="w-full rounded-xl border border-amber-100/20 bg-black/40 px-4 py-3 text-base tracking-wide text-amber-50 placeholder:text-amber-50/35 focus:border-amber-300/60 focus:outline-none"
						/>
					</label>

					<label className="block space-y-2">
						<span className="text-xs font-medium uppercase tracking-[0.22em] text-amber-100/80">Email (Optional)</span>
						<input
							type="email"
							value={email}
							onChange={(event) => {
								setEmail(event.target.value)
								setError(null)
							}}
							placeholder="admin@example.com"
							className="w-full rounded-xl border border-amber-100/20 bg-black/40 px-4 py-3 text-base tracking-wide text-amber-50 placeholder:text-amber-50/35 focus:border-amber-300/60 focus:outline-none"
						/>
					</label>

					<button
						onClick={handleSubmit}
						disabled={isSubmitting || !isPhoneValid}
						className="w-full rounded-xl bg-linear-to-r from-amber-300 to-yellow-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isSubmitting ? 'Processing...' : 'Add Admin'}
					</button>

					{success && (
						<p className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-center text-sm text-emerald-300">
							{success}
						</p>
					)}

					{error && (
						<p className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-center text-sm text-red-300">
							{error}
						</p>
					)}
				</div>
			</div>
		</article>
	)
}
