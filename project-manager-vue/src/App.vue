<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <Navbar />
  <Suspense>
    <template #default>
      <router-view></router-view>
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<style scoped>
a {
  margin-right: 10px;
}
</style>
