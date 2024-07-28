<!-- src/components/Login.vue -->

<template>
  <div>
    <h1>Login</h1>
    <button @click="login">Login with SSO</button>
  </div>
</template>

<script>
import { redirectToSSO } from "../services/authService";

export default {
  methods: {
    login() {
      redirectToSSO();
    },
  },
};
</script>
