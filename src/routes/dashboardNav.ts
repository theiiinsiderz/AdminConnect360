export const dashboardNavItems = [
  { key: 'overview', label: 'Overview', path: '/overview' },
  { key: 'generate', label: 'Generate', path: '/generate' },
  { key: 'bike-users', label: 'Bike Users', path: '/bike-users' },
  { key: 'car-users', label: 'Car Users', path: '/car-users' },
  { key: 'people', label: 'People', path: '/people' },
  { key: 'vendors', label: 'Vendors', path: '/vendors' },
  { key: 'add-admin', label: 'Add Admin', path: '/add-admin' },
] as const

export type DashboardNavKey = (typeof dashboardNavItems)[number]['key']
