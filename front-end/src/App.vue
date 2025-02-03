<script setup>
import { ref, watch , onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import { RouterView } from 'vue-router';

const route = useRoute();
const router = useRouter();

onMounted(() => {
  const _state = localStorage.getItem('state');
  console.log('_state', _state);
  if (_state) {

    const lastRoute = localStorage.getItem('lastRoute');
    console.log('lastRoute', lastRoute);
    router.push(lastRoute);

  }
});

const showNavbar = ref(false); 

watch(route, (newRoute) => {
  showNavbar.value = newRoute.meta.showNavbar; 
}, { immediate: true });
</script>

<template>
  <div id="app">
    <Navbar v-if="showNavbar" /> 
    <RouterView />
  </div>
</template>

<style scoped>
</style>