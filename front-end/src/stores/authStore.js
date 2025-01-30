import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    createdUser: null,
    username: null,
    UID: null,
    isUserAuthenticated: false,
  }),
  actions: {
    confirmRecieveToken(receiveToken) {
      this.isUserAuthenticated = true;
      this.token = receiveToken; 
    },
    getUser(user){
      this.createdUser = user;
      console.log('this.createdUser', this.createdUser)
    },
    getUID(_uid){
      this.UID = _uid;
      console.log('this.createdUser', this.createdUser)
    },
    getUsername(usrn){
      this.username = usrn;
    },
    logout(){
      this.token = null;
      this.isUserAuthenticated = false;
      return true;
    },
  },
  getters: {
    getToken: (state) => state.token,
  },
});
