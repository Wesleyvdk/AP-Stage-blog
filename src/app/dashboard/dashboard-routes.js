export const dashboardRoutes = [
  {
    path: '/dashboard',
    component: () => import('./page/dashboard-page.vue'),
    meta: { requiresAuth: true },
  },
]
