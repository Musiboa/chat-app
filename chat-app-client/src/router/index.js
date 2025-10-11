import { createRouter, createWebHistory } from 'vue-router'

export const menuRoutes = [
  {
    path: 'conversations',
    name: 'conversations',
    meta: {
      title: '消息',
      icon: 'ChatRound'
    },
    component: () => import('@/views/chat/cviews/conversations/index.vue')
  },
  {
    path: 'friends',
    name: 'friends',
    meta: {
      title: '好友',
      icon: 'User'
    },
    component: () => import('@/views/chat/cviews/friends/index.vue')
  }
]

export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/App.vue'),
    redirect: '/chat',
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/login/index.vue')
      },
      {
        path: 'chat',
        name: 'chat',
        component: () => import('@/views/chat/index.vue'),
        redirect: '/chat/conversations',
        children: menuRoutes
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  if (to.name !== 'login' && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
