import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { dashboardNavItems } from '../../routes/dashboardNav'
import BrandLogo from '../../components/BrandLogo'

export default function Home() {
	const [isDesktopSidebarExpanded, setIsDesktopSidebarExpanded] = useState(true)
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
	const location = useLocation()

	useEffect(() => {
		setIsMobileSidebarOpen(false)
	}, [location.pathname])

	const activeTitle = useMemo(() => {
		const match = dashboardNavItems.find((item) => location.pathname === item.path)
		return match?.label ?? 'Overview'
	}, [location.pathname])

	const shouldShowNavItems = isMobileSidebarOpen || isDesktopSidebarExpanded

	return (
		<main className="min-h-screen bg-transparent text-zinc-100">
			{isMobileSidebarOpen && (
				<button
					type="button"
					onClick={() => setIsMobileSidebarOpen(false)}
					aria-label="Close sidebar"
					className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden"
				/>
			)}

			<div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
				<aside
					className={`fixed inset-y-0 left-0 z-40 m-3 border-r border-amber-100/15 p-5 transition-all duration-300 md:static md:z-auto md:m-4 md:mr-0 ${
						isDesktopSidebarExpanded ? 'rounded-3xl' : 'rounded-2xl'
					} premium-surface ${
						isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
					} ${
						isDesktopSidebarExpanded ? 'w-72' : 'md:w-20'
					}`}
				>
					<div className={`mb-8 flex items-center ${shouldShowNavItems ? 'justify-between gap-3' : 'justify-center'}`}>
						<div className="min-w-0">
							<BrandLogo showText={shouldShowNavItems} className={shouldShowNavItems ? '[&>svg]:h-14' : '[&>svg]:h-12'} />
						</div>
						<button
							type="button"
							onClick={() => setIsDesktopSidebarExpanded((prev) => !prev)}
							className="hidden rounded-lg border border-amber-100/20 bg-black/35 px-3 py-2 text-xs font-medium text-amber-100/85 transition hover:bg-zinc-900/85 md:inline-flex"
						>
							{isDesktopSidebarExpanded ? 'Close' : 'Open'}
						</button>
						<button
							type="button"
							onClick={() => setIsMobileSidebarOpen(false)}
							className="rounded-lg border border-amber-100/20 bg-black/35 px-3 py-2 text-xs font-medium text-amber-100/85 transition hover:bg-zinc-900/85 md:hidden"
						>
							Close
						</button>
					</div>

					{shouldShowNavItems && (
						<nav className="space-y-2">
							{dashboardNavItems.map((item) => (
								<NavLink
									key={item.key}
									to={item.path}
									className={({ isActive }) =>
										`premium-action block w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
											isActive
												? 'bg-linear-to-r from-amber-300 to-yellow-500 text-black shadow-[0_10px_28px_rgba(251,191,36,0.28)]'
												: 'text-zinc-300 hover:bg-zinc-900/75 hover:text-amber-100'
										}`
									}
								>
									{item.label}
								</NavLink>
							))}
						</nav>
					)}
				</aside>

				<section className="flex-1 p-4 pt-5 md:p-10 md:pl-9">
					<header className="premium-surface mb-8 flex items-center justify-between rounded-2xl px-6 py-5">
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={() => setIsMobileSidebarOpen(true)}
								className="rounded-lg border border-amber-100/20 bg-black/35 px-3 py-2 text-xs font-medium text-amber-100/85 transition hover:bg-zinc-900 md:hidden"
							>
								Menu
							</button>
							<div>
							<p className="text-xs uppercase tracking-[0.28em] text-amber-200/75">Current Screen</p>
							<h2 className="mt-2 text-2xl font-semibold tracking-tight text-amber-50 md:text-3xl">{activeTitle}</h2>
							</div>
						</div>
						<div className="premium-chip hidden px-4 py-2 text-sm text-amber-100/85 sm:block">
							Admin Access
						</div>
					</header>

					<Outlet />
				</section>
			</div>
		</main>
	)
}
