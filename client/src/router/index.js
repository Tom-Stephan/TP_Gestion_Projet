import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import ClanDashboard from '../components/ClanDashboard.vue' // Reusing component as view for now
import ClanProfileView from '../views/ClanProfileView.vue'
import UserProfile from '../components/UserProfile.vue'
import ShopView from '../views/ShopView.vue'
import LoginView from '../views/LoginView.vue'
import ScanView from '../views/ScanView.vue'

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
      path: '/clan/:id',
      name: 'clan-profile',
      component: ClanProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/scan',
      name: 'scan',
      component: ScanView,
      meta: { requiresAuth: true }
    },
    {
      path: '/shop',
      name: 'shop',
      component: ShopView,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: UserProfile,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
})

// Global Auth Guard
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/'];
  const authRequired = to.meta.requiresAuth; // Or simply !publicPages.includes(to.path) if strict
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
});


export default router
