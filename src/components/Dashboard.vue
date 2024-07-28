<!-- src/components/Dashboard.vue -->

<template>
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {{ user.name }}</p>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { getUserInfo } from '../services/authService';
  
  export default {
    setup() {
      const user = ref({});
  
      onMounted(async () => {
        user.value = await getUserInfo();
      });
  
      return { user };
    }
  };
  </script>
  