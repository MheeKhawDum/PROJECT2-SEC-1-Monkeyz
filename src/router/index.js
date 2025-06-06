// router/index.js หรือไฟล์ router ของคุณ
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/components/HomePage.vue'
import MenuPage from '@/components/MenuPage.vue'
import CustomPage from '@/components/CustomPage.vue'
import CartPopup from '@/components/CartPopup.vue'
import EditPage from '@/components/EditPage.vue'
import EditPageCustom from '../components/EditPageCustom.vue'
import DrinkOptions from '@/components/DrinkOptions.vue'
import History from '../components/History.vue'
import DrinkOptionsCustom from '../components/DrinkOptionsCustom.vue'

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
      path: '/drinkOptioncustom/:id',
      name: 'drinkOptioncustom',
      component: DrinkOptionsCustom
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
      path: '/history',
      name: 'history',
      component: History
    },  
    {
      path: '/editcustom/:id',
      name: 'editCustom',
      component: EditPageCustom
    },    
    {
      path: '/',
      redirect: {name: 'home'}
    }
  ],
})

export default router