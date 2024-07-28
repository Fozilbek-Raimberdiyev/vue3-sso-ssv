<!-- src/components/Login.vue -->

<template>
  <div>
    <h1>Login</h1>
    <button
      style="
        margin-right: 10px;
        background-color: blue;
        color: white;
        padding: 5px 15px;
        border-radius: 5px;
      "
      @click="redirectToSSO"
    >
      Login with SSO
    </button>
  </div>
</template>

<script setup>
import { redirectToSSO } from "../services/authService.ts";
</script>
