import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/App.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue')
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('@/views/chat/index.vue')
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  if (to.name !== 'login' && !isAuthenticated) {
    next({ name: 'login' })
  }
  if (to.name === 'login' && isAuthenticated) {
    next({ name: 'chat' })
  } else {
    next()
  }
})

export default router
