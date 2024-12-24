<template>
    <nav class="bg-blue-500 p-4">
      <div class="container mx-auto flex justify-between items-center">
        <div class="text-white text-lg font-bold">Small App</div>
        <ul class="flex space-x-4">
          <li>
            <div>
              <button @click="handleLogout">Déconnexion</button>
            </div>
          </li>
          <li>
            <router-link to="/home" class="text-white hover:text-gray-200">Accueil</router-link>
          </li>
         
        </ul>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { useAuthStore } from '@/stores/authStore';
  import { useRouter } from 'vue-router';

  const authStore = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    authStore.logout(); // Appel de la méthode de déconnexion
    router.push('/'); // Rediriger vers la page de connexion
};
  </script>
  
  <style scoped>
  
  nav {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  </style>