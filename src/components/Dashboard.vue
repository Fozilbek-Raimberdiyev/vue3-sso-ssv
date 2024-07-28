<!-- src/components/Dashboard.vue -->

<template>
  <div v-if="user">
    <h1>Dashboard</h1>
    <p>Welcome, {{ user.name }}</p>
  </div>

  <div v-else>
    <router-link
      style="
        margin-right: 10px;
        background-color: blue;
        color: white;
        padding: 5px 15px;
        border-radius: 5px;
      "
      to="/auth/login"
      >Login</router-link
    >
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getUserInfo } from "../services/authService.ts";
const user = ref(null);

onMounted(async () => {
  user.value = await getUserInfo();
});
</script>
