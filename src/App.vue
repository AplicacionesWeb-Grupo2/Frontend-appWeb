<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from './components/Sidebar-components.vue';

const route = useRoute();

// Verifica si la ruta actual es el login
const isLoginPage = computed(() => route.name === 'Login');
</script>

<template>
  <div v-if="!isLoginPage" class="app-layout">
    <Sidebar />
    <div class="main-content">
      <router-view />
    </div>
  </div>
  <div v-else class="login-layout">
    <router-view />
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

.login-layout {
  min-height: 100vh;
}
</style>
