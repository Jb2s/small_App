<script setup>
import { ref, watch ,onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import { RouterView } from 'vue-router';
import { initData } from './mocks/mocks';

const route = useRoute();

const showNavbar = ref(false); 

onBeforeMount(() => {
  initData();
})

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