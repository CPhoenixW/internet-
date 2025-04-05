import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import ContentPage from '../views/ContentPage.vue'
import UserPage from '../views/UserPage.vue'
import Community from '../views/Community.vue'
import Course from '../views/Course.vue'

const routes = [
  { path: '/', component: LandingPage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/content', component: ContentPage },
  { path: '/personal', component: UserPage },
  { path: '/community', component: Community },
  { path: '/course', component: Course },
  {
    path: '/video/:id',
    name: 'Video',
    component: () => import('@/views/Video.vue')
  },
  {
    path: '/live/:id',
    name: 'Live',
    component: () => import('@/views/Live.vue')
  },
  {
    path: '/live/:id/replay',
    name: 'LiveReplay',
    component: () => import('@/views/Live.vue')
  },
  {
    path: '/ppt/:id',
    name: 'PPT',
    component: () => import('@/views/PPT.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router