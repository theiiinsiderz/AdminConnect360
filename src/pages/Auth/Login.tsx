import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandLogo from '../../components/BrandLogo'

export default function Login() {
	const navigate = useNavigate()
	const [phone, setPhone] = useState('')
	const [otp, setOtp] = useState('')
	const [otpSent, setOtpSent] = useState(false)
	const [submitting, setSubmitting] = useState(false)
	const [message, setMessage] = useState('')

	const phoneDigits = phone.replace(/\D/g, '').slice(0, 10)
	const otpDigits = otp.replace(/\D/g, '').slice(0, 6)
	const isPhoneValid = phoneDigits.length === 10
	const isOtpValid = otpDigits.length === 6

	const sendOtp = async () => {
		if (!isPhoneValid) {
			setMessage('Enter a valid 10-digit phone number.')
			return
		}

		setSubmitting(true)
		setOtpSent(true)
		setMessage('OTP sent (dummy mode). Enter any OTP to continue.')
		setSubmitting(false)
	}

	const handleSendOtpSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault()
		sendOtp()
	}

	const handleVerify = async (event: SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!isPhoneValid) {
			setMessage('Enter a valid 10-digit phone number first.')
			return
		}

		if (!isOtpValid) {
			setMessage('Enter a valid 6-digit OTP.')
			return
		}

		setSubmitting(true)
		setMessage('Login successful. Redirecting...')

		const dummyUser = {
			id: 'dummy-admin',
			phoneNumber: phoneDigits,
			role: 'admin'
		}

		localStorage.setItem('token', 'dummy-token')
		localStorage.setItem('user', JSON.stringify(dummyUser))
		localStorage.setItem('role', 'admin')

		navigate('/overview', { replace: true })
		setSubmitting(false)
	}

	return (
		<main className="relative min-h-screen overflow-hidden bg-transparent text-white">
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-400/20 blur-3xl" />
				<div className="absolute -bottom-16 left-10 h-72 w-72 rounded-full bg-yellow-300/10 blur-3xl" />
				<div className="absolute right-10 top-20 h-52 w-52 rounded-full bg-amber-200/10 blur-3xl" />
			</div>

			<div className="relative z-10 flex min-h-screen items-center justify-center p-6">
				<section className="premium-surface w-full max-w-md rounded-3xl p-8 shadow-[0_0_80px_rgba(251,191,36,0.15)]">
					<div className="mb-8 space-y-3 text-center">
						<div className="flex justify-center">
							<BrandLogo className="[&>svg]:h-16" />
						</div>
						<p className="text-xs font-semibold tracking-[0.35em] text-amber-200/80">CARCARD ADMIN</p>
						<p className="text-sm text-amber-100/70">Sign in securely with your phone number and one-time passcode.</p>
					</div>

					<form className="space-y-5" onSubmit={otpSent ? handleVerify : handleSendOtpSubmit}>
						<label className="block space-y-2">
							<span className="text-xs font-medium uppercase tracking-[0.22em] text-amber-100/80">Phone Number</span>
							<div className="flex items-center rounded-xl border border-amber-100/20 bg-black/40 px-4">
								<span className="pr-2 text-amber-100/70">+91</span>
								<input
									type="tel"
									inputMode="numeric"
									autoComplete="tel"
									placeholder="987 654 3210"
									value={phoneDigits}
									onChange={(event) => {
										setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))
										setMessage('')
									}}
									className="w-full border-0 bg-transparent py-3 text-base tracking-wide text-amber-50 placeholder:text-amber-50/35 focus:outline-none"
								/>
							</div>
						</label>

						<label className="block space-y-2">
							<span className="text-xs font-medium uppercase tracking-[0.22em] text-amber-100/80">One-Time Password</span>
							<input
								type="text"
								inputMode="numeric"
								autoComplete="one-time-code"
								placeholder="Enter 6-digit OTP"
								value={otpDigits}
								onChange={(event) => {
									setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))
									setMessage('')
								}}
								className="w-full rounded-xl border border-amber-100/20 bg-black/40 px-4 py-3 text-base tracking-[0.3em] text-amber-50 placeholder:text-amber-50/35 focus:border-amber-300/60 focus:outline-none"
							/>
						</label>

						<button
							type="submit"
							disabled={submitting || (!otpSent ? !isPhoneValid : !isOtpValid)}
							className="w-full rounded-xl bg-linear-to-r from-amber-300 to-yellow-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{submitting ? 'Verifying...' : otpSent ? 'Verify & Login' : 'Send OTP'}
						</button>

						<div className="flex items-center justify-between text-xs text-amber-100/70">
							<span>{otpSent ? 'Didn’t receive OTP?' : 'OTP will be sent instantly'}</span>
							<button
								type="button"
								disabled={submitting || !isPhoneValid}
								onClick={sendOtp}
								className="font-medium text-amber-300 transition hover:text-amber-200 disabled:cursor-not-allowed disabled:text-amber-100/35"
							>
								{otpSent ? 'Resend OTP' : 'Send now'}
							</button>
						</div>

						{message && (
							<p className="rounded-lg border border-amber-100/20 bg-amber-50/5 px-3 py-2 text-center text-sm text-amber-100/90">
								{message}
							</p>
						)}
					</form>
				</section>
			</div>
		</main>
	)
}
