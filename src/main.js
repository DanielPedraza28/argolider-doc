import './assets/tailwind.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { getAuth, signInAnonymously } from 'firebase/auth'
import { app as firebaseApp } from './firebase/config'

const auth = getAuth(firebaseApp)
signInAnonymously(auth)
  .then(() => {
    createApp(App).use(router).mount('#app')
  })
  .catch(error => {
    console.error('❌ Error al iniciar sesión anónima:', error)
  })
