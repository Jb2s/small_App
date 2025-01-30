import './style.css' 


import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { io } from 'socket.io-client';

const app = createApp(App)

const socket = io(import.meta.env.VITE_URL_SOCKET);
app.config.globalProperties.$socket = socket;

app.use(createPinia())
app.use(router)

app.mount('#app')
