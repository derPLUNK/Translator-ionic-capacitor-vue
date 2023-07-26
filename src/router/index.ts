import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Translate from '../views/Translate.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/translate'
  },
  {
    path: '/translate',
    name: 'Translate',
    component: Translate
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
