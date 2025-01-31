<template>
  <nav class="bg-indigo-600 p-4 shadow-lg">
    <div class="container mx-auto flex justify-between items-center">
      <!-- Titre et bouton menu -->
      <div class="flex items-center space-x-6">
        <div class="text-white text-xl font-bold">TODO</div>

        <!-- Menu toggle (mobile) -->
        <button 
          @click="toggleMenu" 
          class="text-white md:hidden focus:outline-none "
        >
          <i class="fas fa-bars text-2xl"></i>
        </button>
      </div>

      <!-- Menu mobile coulissant -->
      <div 
        :class="['fixed top-0 left-0 bg-indigo-600 w-3/4 h-full z-50 transform transition-transform duration-300 md:hidden', isMenuOpen ? 'translate-x-0' : '-translate-x-full',] "
      >
        <div class="p-4">
          <button @click="toggleMenu" class="text-white mb-6">
            <i class="fas fa-times text-2xl"></i>
          </button>
          <router-link
            to="/home"
            class="block text-white hover:bg-indigo-500 hover:text-gray-100 px-4 py-2 rounded-sm"
            active-class="border-b-2 border-indigo-400"
          >
            Accueil
          </router-link>
          <router-link
            to="/comunity"
            class="block text-white hover:bg-indigo-500 hover:text-gray-100 px-4 py-2 rounded-sm"
            active-class="border-b-2 border-indigo-400"
          >
            Communauté
          </router-link>
          <button
            @click="handleLogout"
            class="mt-4 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition duration-300"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <!-- Liens de navigation desktop -->
      <div class="hidden md:flex space-x-4">
        <router-link
          to="/home"
          class="text-white hover:bg-indigo-500 hover:text-gray-100 px-4 py-2 rounded-sm"
          active-class="border-b-2 border-indigo-400"
        >
          Accueil
        </router-link>
        <router-link
          to="/comunity"
          class="text-white hover:bg-indigo-500 hover:text-gray-100 px-4 py-2 rounded-sm"
          active-class="border-b-2 border-indigo-400"
        >
          Communauté
        </router-link>
        <button
          @click="handleLogout"
          class="text-white hover:bg-indigo-500 hover:text-gray-100 px-4 py-2 rounded-full transition duration-300"
        >
          Déconnexion
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const authStore = useAuthStore();
const router = useRouter();
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

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
.container {
  max-width: 1200px;
}
</style>
