// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Callback from '../components/Callback.vue';
import Dashboard from '../components/Dashboard.vue'; // Secure page

const routes = [
    { path: '/login', component: Login },
    { path: '/callback', component: Callback },
    {
      path: '/dashboard',
      component: Dashboard,
      beforeEnter: (to, from, next) => {
        if (isAuthenticated()) {
          next();
        } else {
          next('/login');
        }
      }
    },
  ];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
