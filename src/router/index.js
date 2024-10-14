// router/index.js หรือไฟล์ router ของคุณ
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/components/HomePage.vue'
import MenuPage from '@/components/MenuPage.vue'
import CustomPage from '@/components/CustomPage.vue'
import CartPopup from '@/components/CartPopup.vue'
import EditPage from '@/components/EditPage.vue'
import DrinkOptions from '@/components/DrinkOptions.vue'

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
      component: MenuPage,
      // children: [
      //   {
      //     path: '/cart',
      //     name: 'cart',
      //     component: CartPopup           
      //   }
      // ]
    },
    {
      path: '/custom',
      name: 'customPage',
      component: CustomPage
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: EditPage
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartPopup           
    },
    {
      path: '/drinkOption/:name',
      name: 'drinkOption' ,
      component: DrinkOptions
    },
    {
      path: '/',
      redirect: {name: 'home'}
    }
  ],
})

export default router