import { createRouter, createWebHistory } from 'vue-router'
import { authRoutes } from './app/auth/auth-routes'
import { dashboardRoutes } from './app/dashboard/dashboard-routes'
import { blogRoutes } from './app/blog/blog-routes'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./app/home/home-page.vue'),
    },
    ...authRoutes,
    ...dashboardRoutes,
    ...blogRoutes,
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isAuthenticated = !!localStorage.getItem('token')

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
