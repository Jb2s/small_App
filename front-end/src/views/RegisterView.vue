<template>
    <main>
      <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <form @submit.prevent="handleRegister" :class="['bg-white p-6 rounded shadow-md w-80', errorCode === 'U100' ? 'border-2 border-red-500' : 'border' ]">
          <h2 class="text-center text-2xl font-bold mb-4">Register</h2>
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
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="email"
              type="text"
              id="username"
              required
              :class="['mt-1 block w-full border rounded-md p-2 focus:ring focus:ring-blue-200', 
                        errorCode === 'U001' ? 'border-red-500 focus:ring focus:ring-red-300' : 'border-gray-300' 
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
              class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
          >
            S'inscrire
          </button>
          <div class="mt-4 text-center">
            <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
          </div>
        </form>
      </div>
    </main>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { addUser } from '@/services/userService'; 
  import { manageErrorCodeUser } from '@/Utils/manageUtils';
  import { useAuthStore } from '@/stores/authStore';

  
  const router = useRouter();
  const username = ref('');
  const email = ref('');
  const password = ref('');
  const errorCode = ref('');
  const errorMessage = ref('');
  const authStore = useAuthStore();

  
  const handleRegister = async () => {
  errorMessage.value = '';

  try {
    const _response = await addUser(username.value, email.value, password.value);

    console.log('handleRegister._response >> ', _response);
    
    if (_response.user) {
      router.push('/');
      authStore.getUser(_response.user);
      username.value = '';
      email.value = '';
      password.value = '';
    }

  } catch (error) {
    const errorResponse = manageErrorCodeUser(error.code, error.message);
    errorCode.value = errorResponse.code;
    errorMessage.value = errorResponse.message;
    console.error('handleRegister.error >> ', error);
  }
};
  
  </script>
  
  <style scoped>
  /* Ajoutez vos styles ici si nécessaire */
  </style>