import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    createdUser: null,
    username: null,
    UID: 0,
    isUserAuthenticated: false,
  }),
  actions: {
    confirmRecieveToken(receiveToken) {
      this.isUserAuthenticated = true;
      this.token = receiveToken; 
      localStorage.setItem('state', this.isUserAuthenticated); 

    },
    checkSession(){

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
    toggleStateToFalse() {
      const currentValue = JSON.parse(localStorage.getItem('state'));
      if (currentValue === true) {
        localStorage.setItem('state', JSON.stringify(false));
      } else {
        console.log("state n'était pas true ou déjà false.");
      }
    },
    logout(){
      this.token = null;
      this.isUserAuthenticated = false;
      this.toggleStateToFalse();
      return true;
    },
  },
  persist: {
    key: 'auth-store', 
    storage: sessionStorage,
  },
  getters: {
    getToken: (state) => state.token,
  },
});
