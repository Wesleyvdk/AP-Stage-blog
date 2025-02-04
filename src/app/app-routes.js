import { authRoutes } from './auth/auth-routes'
import { dashboardRoutes } from './dashboard/dashboard-routes'
import { blogRoutes } from './blog/blog-routes'
import { homeRoutes } from './home/home-routes'
import { aboutRoutes } from './about/about-routes'

const baseRoutes = [
  {
    path: '/',
    redirect: '/home',
  },
]

export default [
  ...dashboardRoutes,
  ...authRoutes,
  ...blogRoutes,
  ...homeRoutes,
  ...aboutRoutes,
  ...baseRoutes,
]
