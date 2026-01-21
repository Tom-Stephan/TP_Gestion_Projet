import { createRouter, createWebHistory } from 'vue-router'

// Views (Placeholder components for now, except Home)
import HomeView from '../views/HomeView.vue'
import ClanDashboard from '../components/ClanDashboard.vue' // Reusing component as view for now
import UserProfile from '../components/UserProfile.vue'
import ShopView from '../views/ShopView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/clan',
      name: 'clan',
      component: ClanDashboard
    },
    {
      path: '/scan',
      name: 'scan',
      component: { template: '<div class="p-4 text-center"><h1 class="text-2xl font-bold">Scanner (US-02)</h1><p>Camera integration here</p></div>' }
    },
    {
      path: '/shop',
      name: 'shop',
      component: ShopView
    },
    {
      path: '/profile',
      name: 'profile',
      component: UserProfile
    }
  ]
})


export default router
