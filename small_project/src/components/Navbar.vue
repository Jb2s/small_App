<template>
  <nav class="bg-blue-500 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="flex items-center">
        <div class="text-white text-lg font-bold">Small App</div>
        <router-link to="/home" class="text-white hover:text-gray-200 ml-4">Accueil</router-link>
      </div>
      <div>
        <button @click="handleLogout" class="text-white hover:text-gray-200"><i class="fas fa-sign-out-alt mr-2"></i>Déconnexion</button>
      </div>
    </div>
  </nav>
</template>
  
<script setup>
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout(); 
  router.push('/'); 
};
</script>

<style scoped>

nav {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>