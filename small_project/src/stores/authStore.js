import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    users: [],
    authenticatedUser: null,
  }),
  actions: {
    loadUsers() {
      this.users = JSON.parse(localStorage.getItem('users')) || [];
    },
    login(username, password) {
      const user = this.users.find(
        (u) => u.user_name === username && u.password === password
      );
      if (user) {
        user.is_authenticated = true;
        localStorage.setItem('users', JSON.stringify(this.users));
        this.authenticatedUser = user;
        return true; 
      }
      return false; 
    },
    logout() {
      if (this.authenticatedUser) {
        const index = this.users.findIndex(u => u.id === this.authenticatedUser.id);
        if (index !== -1) {
          this.users[index].is_authenticated = false;
          localStorage.setItem('users', JSON.stringify(this.users));
        }
        this.authenticatedUser = null;
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.authenticatedUser,
  },
});