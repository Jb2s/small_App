<template>
  <main>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div >
        <form @submit.prevent="handleLogin" :class="['bg-white p-6 rounded shadow-md w-80', errorCode === 'U010' ? 'border-2 border-red-500' : 'border' ]">
          <h2 class="text-center text-indigo-500 text-2xl font-bold mb-4">Connexion</h2>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="email"
              type="text"
              id="username"
              required
              :class="['mt-1 block w-full border rounded-md p-2 focus:ring focus:ring-indigo-200', 
                        errorCode === 'U001' ? 'border-2 border-red-500 focus:ring focus:ring-red-300' : 'border-gray-300' 
              ]"
            />
          </div>
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              v-model="password"
              type="password"
              id="password"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-indigo-200"
              
            />
            
          </div>
          <button
            type="submit"
            class="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
          >
            Se connecter
          </button>
          <div class="mt-4 text-center">
            <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
          </div>
        </form>
        <div class="mt-4 text-center">
          <p class="text-indigo-500 text-sm">
            <router-link to="/register"> Pas encore de compte ? Inscrivez-vous ici</router-link>
          </p>
        </div>
      </div>
      
    </div>
    
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authenticateUser } from '@/services/userService'; 
import { useAuthStore } from '../stores/authStore'; 
import { manageErrorCodeUser } from '@/Utils/manageUtils';

const router = useRouter();
const email = ref('');
const password = ref('');
const _token = ref('');
const errorCode = ref('');
const errorMessage = ref('');
const authStore = useAuthStore();
 
const handleLogin = async () => {
  errorCode.value = '';

  try {
    const _response = await authenticateUser(email.value, password.value);
    console.log('handleLogin._response >> ', _response);
    console.log('authStore.createdUser', authStore.createdUser);
    _token.value = _response.token;

    if (_token.value) {
      authStore.confirmRecieveToken(_token.value);
      router.push('/home');
      authStore.getUID(_response.uid);
      authStore.getUsername(_response.username);
      email.value = '';
      password.value = '';
    }

  } catch (error) {
    const errorResponse = manageErrorCodeUser(error.code, error.message);
    errorCode.value = errorResponse.code; 
    errorMessage.value = errorResponse.message; 
    console.error('handleLogin.error >> ', error);
  }
};

</script>

<style scoped>
/* Ajoutez vos styles ici si nécessaire */
</style>