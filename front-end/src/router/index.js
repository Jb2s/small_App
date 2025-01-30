import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';
import RegisterView from '../views/RegisterView.vue';
import ComunityView from '../views/ComunityView.vue';
import { useAuthStore } from '@/stores/authStore';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { showNavbar: false },
    },
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: { showNavbar: false }, 
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { showNavbar: true, requiresAuth: true }, 
    },
    {
      path: '/comunity',
      name: 'comunity',
      component: ComunityView,
      meta: { showNavbar: true, requiresAuth: true }, 
    },
    {
      path: '/comunity/:id',
      name: 'comunity_id',
      component: () => import('@/views/ComunityDetailView.vue'),
      meta: { showNavbar: true, requiresAuth: true }, 
    },
  ],
});


router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  const _isUserAuthenticated = authStore.isUserAuthenticated;
  console.log('_isUserAuthenticated',_isUserAuthenticated)

  if (to.meta.requiresAuth && !_isUserAuthenticated) {
    next('/'); 
  } else {
    next(); 
  }
});

export default router;
