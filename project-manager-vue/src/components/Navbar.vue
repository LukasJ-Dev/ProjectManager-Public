<script setup lang="ts"></script>
<template>
  <nav class="bg-blue-500 w-full">
    <div class="flex flex-row justify-between px-2">
      <router-link to="/" class="flex items-center">
        <span
          class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
          >Project Manager</span
        >
      </router-link>
      <ul class="flex flex-row p-4 text-white gap-4">
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/register">Register</router-link></li>
      </ul>
    </div>
  </nav>
</template>
