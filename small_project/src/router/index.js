import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';
import { useAuthStore } from '@/stores/authStore';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
  ],
});



router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.loadUsers(); // Charger les utilisateurs pour vérifier l'authentification

  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/'); // Rediriger vers la page d'accueil si non authentifié
  } else {
    next(); // Continuer vers la route demandée
  }
});

export default router;
