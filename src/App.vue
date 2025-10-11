<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from './components/Sidebar-components.vue';
import LanguageSwitcher from './components/LanguageSwitcher-components.vue';

const route = useRoute();
const isLoginPage = computed(() => route.name === 'Login');
</script>

<template>
  <div v-if="!isLoginPage" class="app-layout">
    <Sidebar />
    <div class="main-content">
      <router-view />
    </div>
    <LanguageSwitcher /> <!-- Siempre visible arriba a la derecha -->
  </div>

  <div v-else class="login-layout">
    <router-view />
    <LanguageSwitcher /> <!-- Opcional: también visible en login -->
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
