<!-- src/components/Callback.vue -->

<template>
  <div>
    <h1>Authenticating...</h1>
  </div>
</template>

<script>
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getToken } from "../services/authService";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();

    onMounted(async () => {
      const code = route.query.code;
      const state = route.query.state;

      if (state !== localStorage.getItem("pkce_state")) {
        console.error("Invalid state");
        return;
      }

      try {
        await getToken(code);
        router.push("/dashboard"); // Redirect to a secure page
      } catch (error) {
        console.error("Authentication failed", error);
      }
    });
  },
};
</script>
