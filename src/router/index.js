// router/index.js หรือไฟล์ router ของคุณ
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/components/HomePage.vue'
import MenuPage from '@/components/MenuPage.vue'
import CustomPage from '@/components/CustomPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  //history: createWebHistory("/nw3/"),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/menu',
      name: 'menuPage',
      component: MenuPage
    },
    {
      path: '/custom',
      name: 'customPage',
      component: CustomPage
    }
  ],
})

export default router
