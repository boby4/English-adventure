import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GameView from '../views/GameView.vue'
import CollectionView from '../views/CollectionView.vue'
import ConnectGameView from '../views/ConnectGameView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/game',
      name: 'game',
      component: GameView
    },
    {
      path: '/collection',
      name: 'collection',
      component: CollectionView
    },
    {
      path: '/connect',
      name: 'connect',
      component: ConnectGameView
    }
  ]
})

export default router