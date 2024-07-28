// src/router/index.js

import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Callback from "../components/Callback.vue";
import Dashboard from "../components/Dashboard.vue"; // Secure page

const routes = [
  { path: "/", redirect: "/dashboard" },
  { path: "/auth/login", component: Login },
  { path: "/auth/callback", component: Callback },
  {
    path: "/dashboard",
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      const isAuthenticated = localStorage.getItem("access_token");

      if (isAuthenticated) {
        next();
      } else {
        next("/auth/login");
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
