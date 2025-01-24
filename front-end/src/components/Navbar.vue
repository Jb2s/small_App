<template>
  <nav class="bg-indigo-600 p-4 shadow-lg">
    <div class="container mx-auto flex justify-between items-center">
      <div class="flex items-center space-x-6">
        <div class="text-white text-xl font-bold">TODO</div>
        <div class="flex space-x-4">
          <router-link
            to="/home"
            class="text-white hover:bg-indigo-500 hover:text-gray-100 px-4 py-2 rounded-full transition duration-300"
            active-class="bg-indigo-700 text-white"
          >
            Accueil
          </router-link>
          <router-link
            to="/comunity"
            class="text-white hover:bg-indigo-500 hover:text-gray-100 px-4 py-2 rounded-full transition duration-300"
            active-class="bg-indigo-700 text-white"
          >
            Comunaute
          </router-link>
        </div>
      </div>
      <div>
        <button
          @click="handleLogout"
          class="text-white hover:bg-indigo-500 hover:text-gray-100 px-4 py-2 rounded-full transition duration-300 flex items-center"
        >
          <span>Déconnexion</span>
          <i class="fas fa-sign-out-alt ml-2"></i>
        </button>
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
  const askLogout = authStore.logout();
  if (askLogout) {
    router.push('/');
  }
};
</script>

<style scoped>
nav {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.router-link-active {
  background-color: rgb(67 56 202); 
  color: white;
}
</style>