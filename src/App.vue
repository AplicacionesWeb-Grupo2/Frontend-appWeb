<script setup>
import Sidebar from './components/Sidebar-components.vue';
</script>

<template>
  <div class="app-layout">
    <Sidebar />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: #e8f1fc;
}

.main-content {
  flex: 1;
  padding: 2rem;
}
</style>
