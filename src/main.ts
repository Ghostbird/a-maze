import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './assets/main.css'
import App from './App.vue'
import MazeGame from '@/components/MazeGame.vue'
import MazeSettings from '@/components/MazeSettings.vue'

createApp(App)
  .use(
    createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: MazeGame },
        { path: '/settings', component: MazeSettings }
      ]
    })
  )
  .mount('#app')
