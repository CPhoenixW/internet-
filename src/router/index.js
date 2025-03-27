import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import ContentPage from '../views/ContentPage.vue'
import UserPage from '../views/UserPage.vue'


const routes = [
  { path: '/', component: LandingPage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/content', component: ContentPage },
  { path: '/personal', component: UserPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router