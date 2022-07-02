import { createRouter, createWebHistory } from 'vue-router'
import App2 from "@/scroll/App2.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: App2
    },
    {
      path: '/about',
      name: 'about',
      component: App2
    }
  ]
})

export default router
