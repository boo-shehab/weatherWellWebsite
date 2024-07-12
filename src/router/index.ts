/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/auth/login"),
  },
  {
    path: "/",
    name: "Home",
    component: () => import("@/pages/"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/pages/auth/register"),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  // extendRoutes: setupLayouts,
  routes,
})

export default router
