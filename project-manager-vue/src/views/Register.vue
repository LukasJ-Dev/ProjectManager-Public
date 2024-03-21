<script setup lang="ts">
import { ref } from "vue";
import * as api from "../api";
import { useStore } from "../store";

const store = useStore();

const email = ref("");
const password = ref("");
const firstName = ref("");
const lastName = ref("");

const login = async () => {
  const { user, token } = await api.register(
    email.value,
    password.value,
    firstName.value,
    lastName.value,
    ""
  );
  console.log(token);
  localStorage.setItem("token", token);
  store.login(user);
};
</script>

<template>
  <Suspense>
    <template #default>
      <div>
        <h2>Register</h2>

        <input type="text" placeholder="Email" v-model="email" />

        <input type="text" placeholder="first name" v-model="firstName" />

        <input type="text" placeholder="last name" v-model="lastName" />

        <input type="password" placeholder="Password" v-model="password" />
        <button @click="login">Login</button>
      </div>
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
