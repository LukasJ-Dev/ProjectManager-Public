<script setup lang="ts">
import { ref } from "vue";
import * as api from "../api";
import { useStore } from "../store";

const store = useStore();

const email = ref("");
const password = ref("");

const login = async () => {
  const { user, token } = await api.login(email.value, password.value);
  localStorage.setItem("token", token);
  store.login(user);
};
</script>

<template>
  <Suspense>
    <template #default>
      <div>
        <h2>Login</h2>
        <input type="text" placeholder="Email" v-model="email" />
        <input type="password" placeholder="Password" v-model="password" />
        <button @click="login">Login</button>
      </div>
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
