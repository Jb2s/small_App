import './style.css' 


import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { io } from 'socket.io-client';
import piniaPersistedState from 'pinia-plugin-persistedstate';

const app = createApp(App)
const pinia = createPinia();

const socket = io(import.meta.env.VITE_URL_SOCKET);
app.config.globalProperties.$socket = socket;


app.use(pinia)
app.use(router)
pinia.use(piniaPersistedState);

app.mount('#app')

export default pinia;
