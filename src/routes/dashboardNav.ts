export const dashboardNavItems = [
  { key: 'overview', label: 'Overview', path: '/overview' },
  { key: 'generate', label: 'Generate', path: '/generate' },
  {
    key: 'tags',
    label: 'Tags',
    path: '/tags',
    children: [
      { key: 'car-tags', label: 'Car Tags', path: '/tags/car' },
      { key: 'bike-tags', label: 'Bike Tags', path: '/tags/bike' },
      { key: 'pet-tags', label: 'Pet Tags', path: '/tags/pet' },
      { key: 'kid-tags', label: 'Kid Tags', path: '/tags/kid' },
    ],
  },
  { key: 'vendors', label: 'Vendors', path: '/vendors' },
  { key: 'add-admin', label: 'Add Admin', path: '/add-admin' },
] as const

export type DashboardNavKey = (typeof dashboardNavItems)[number]['key']
