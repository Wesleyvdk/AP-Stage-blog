export const blogRoutes = [
  {
    path: '/blog',
    component: () => import('./page/blog-page.vue'),
  },
  {
    path: '/blog/new',
    component: () => import('./page/new-post-page.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/blog/:id',
    component: () => import('./page/post-page.vue'),
  },
]
