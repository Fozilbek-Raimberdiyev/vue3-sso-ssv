<!-- src/components/Login.vue -->

<template>
  <div>
    <h1>Login</h1>
    <button style="margin-right: 10px; background-color: blue; color: white; padding: 5px 15px; border-radius: 5px" @click="login">Login with SSO</button>
  </div>
</template>

<script>
import { redirectToSSO } from "../services/authService.ts";

export default {
  methods: {
    login() {
      redirectToSSO();
    },
  },
};
</script>
