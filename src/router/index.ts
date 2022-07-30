import { createRouter, createWebHistory } from 'vue-router'
import Story from "@/Story.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Story
    }
  ]
})

export default router
