import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { showNavbar: false },
    },
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { showNavbar: false }, 
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { showNavbar: true, requiresAuth: true }, 
    },
    {
      path: '/comunity',
      name: 'comunity',
      component: () => import('@/views/ComunityView.vue'),
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

  const _isUserAuthenticated = localStorage.getItem('state');;
  console.log('_isUserAuthenticated',_isUserAuthenticated)

  if (to.meta.requiresAuth && !_isUserAuthenticated) {
    next('/'); 
  } else {
    localStorage.setItem('lastRoute', to.fullPath); 
    next(); 
  }
});

export default router;
