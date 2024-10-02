// router/index.js หรือไฟล์ router ของคุณ
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/components/HomePage.vue'
import MenuPage from '@/components/MenuPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  //history: createWebHistory("/nw3/"),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomePage
    },
    {
      path: '/menu',
      name: 'menuPage',
      component: MenuPage
    }
  ],
})

export default router
