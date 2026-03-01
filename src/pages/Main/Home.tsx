import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { dashboardNavItems } from '../../routes/dashboardNav'
import BrandLogo from '../../components/BrandLogo'

export default function Home() {
	const [isDesktopSidebarExpanded, setIsDesktopSidebarExpanded] = useState(true)
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
	const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
	const location = useLocation()

	useEffect(() => {
		setIsMobileSidebarOpen(false)
		setExpandedGroups((prev) => ({
			...prev,
			tags: prev.tags ?? location.pathname.startsWith('/tags')
		}))
	}, [location.pathname])

	const activeTitle = useMemo(() => {
		const match = dashboardNavItems.find((item) => location.pathname === item.path)
		return match?.label ?? 'Overview'
	}, [location.pathname])

	const shouldShowNavItems = isMobileSidebarOpen || isDesktopSidebarExpanded

	const toggleGroup = (key: string, nextValue: boolean) => {
		setExpandedGroups((prev) => ({
			...prev,
			[key]: nextValue
		}))
	}

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

			<div className="mx-auto flex min-h-screen w-full max-w-400">
				<aside
					className={`fixed inset-y-0 left-0 z-40 m-3 border-r border-amber-100/15 p-5 transition-all duration-300 md:static md:z-auto md:m-4 md:mr-0 ${isDesktopSidebarExpanded ? 'rounded-3xl' : 'rounded-2xl'
						} premium-surface ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
						} ${isDesktopSidebarExpanded ? 'w-72' : 'md:w-20'
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
							{dashboardNavItems.map((item) => {
								const hasChildren = 'children' in item
								const isActive = location.pathname.startsWith(item.path)
								const isExpanded = hasChildren ? (expandedGroups[item.key] ?? isActive) : false

								return (
									<div key={item.key} className="space-y-1">
										{hasChildren ? (
											<>
												<button
													onClick={() => toggleGroup(item.key, !isExpanded)}
													className={`premium-action flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition ${isActive
															? 'bg-linear-to-r from-amber-300 to-yellow-500 text-black shadow-[0_10px_28px_rgba(251,191,36,0.28)]'
															: 'text-zinc-300 hover:bg-zinc-900/75 hover:text-amber-100'
														}`}
												>
													<span>{item.label}</span>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
														className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
													>
														<polyline points="6 9 12 15 18 9"></polyline>
													</svg>
												</button>
												{isExpanded && (
													<div className="ml-4 flex flex-col gap-1 border-l border-amber-100/10 pl-2">
														{item.children.map((child) => (
															<NavLink
																key={child.key}
																to={child.path}
																className={({ isActive: isChildActive }) =>
																	`block rounded-lg px-4 py-2 text-sm transition ${isChildActive
																		? 'bg-amber-100/10 text-amber-200'
																		: 'text-zinc-400 hover:bg-zinc-900/50 hover:text-amber-100'
																	}`
																}
															>
																{child.label}
															</NavLink>
														))}
													</div>
												)}
											</>
										) : (
											<NavLink
												to={item.path}
												className={({ isActive: isNavLinkActive }) =>
													`premium-action block w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${isNavLinkActive
														? 'bg-linear-to-r from-amber-300 to-yellow-500 text-black shadow-[0_10px_28px_rgba(251,191,36,0.28)]'
														: 'text-zinc-300 hover:bg-zinc-900/75 hover:text-amber-100'
													}`
												}
											>
												{item.label}
											</NavLink>
										)}
									</div>
								)
							})}
						</nav>
					)}
				</aside>

				<section className="flex-1 p-4 pb-24 pt-4 md:p-10 md:pb-10 md:pl-9">
					<header className="premium-surface sticky top-3 z-20 mb-8 flex items-center justify-between rounded-2xl px-4 py-4 sm:px-6 sm:py-5">
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={() => setIsMobileSidebarOpen(true)}
								className="inline-flex items-center rounded-xl border border-amber-200/35 bg-amber-300/15 p-2.5 text-amber-100 transition hover:bg-amber-300/25 md:hidden"
								aria-label="Open sidebar"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<line x1="4" y1="6" x2="20" y2="6"></line>
									<line x1="4" y1="12" x2="20" y2="12"></line>
									<line x1="4" y1="18" x2="20" y2="18"></line>
								</svg>
							</button>
							<div>
								<p className="text-xs uppercase tracking-[0.28em] text-amber-200/75">Current Screen</p>
								<h2 className="mt-2 text-xl font-semibold tracking-tight text-amber-50 sm:text-2xl md:text-3xl">{activeTitle}</h2>
							</div>
						</div>
						<div className="premium-chip hidden px-4 py-2 text-sm text-amber-100/85 sm:block">
							Admin Access
						</div>
					</header>

					<Outlet />
				</section>
			</div>

			{!isMobileSidebarOpen && (
				<button
					type="button"
					onClick={() => setIsMobileSidebarOpen(true)}
					className="fixed bottom-5 right-5 z-30 inline-flex items-center rounded-full border border-amber-200/35 bg-linear-to-r from-amber-300 to-yellow-500 p-3 text-black shadow-[0_10px_28px_rgba(251,191,36,0.25)] transition hover:brightness-110 md:hidden"
					aria-label="Open sidebar"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<line x1="4" y1="6" x2="20" y2="6"></line>
						<line x1="4" y1="12" x2="20" y2="12"></line>
						<line x1="4" y1="18" x2="20" y2="18"></line>
					</svg>
				</button>
			)}
		</main>
	)
}
