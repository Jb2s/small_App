<template>
  <main>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <form @submit.prevent="handleLogin" class="bg-white p-6 rounded shadow-md w-80">
        <h2 class="text-center text-2xl font-bold mb-4">Connexion</h2>
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
          <input
            v-model="username"
            type="text"
            id="username"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            v-model="password"
            type="password"
            id="password"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Se connecter
        </button>
        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted  } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore'; 

const router = useRouter();
const authStore = useAuthStore(); 
const username = ref('');
const password = ref('');
const errorMessage = ref('');

onMounted(() => {
  authStore.loadUsers(); 
});

const handleLogin = async () => {
  errorMessage.value = '';

  const success = authStore.login(username.value, password.value);
  
  if (success) {
    router.push('/home'); 
  } else {
    errorMessage.value = 'Identifiants invalides.'; 
  }
};
</script>

<style scoped>
/* Ajoutez vos styles ici si nécessaire */
</style>