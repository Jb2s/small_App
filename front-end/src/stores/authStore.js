import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    authenticatedUser: null,
    isUserAuthenticated: false
  }),
  actions: {
    confirmRecieveToken(receiveToken) {
      localStorage.setItem('token', receiveToken);
      this.isUserAuthenticated = true;
      this.token = receiveToken; 
    },

    getRecieveToken() {
      this.token = localStorage.getItem('token');
    },
    
    loadUsers() {
      this.users = JSON.parse(localStorage.getItem('users')) || [];
    },
  },
  getters: {
    getToken: (state) => state.token,
  },
});
