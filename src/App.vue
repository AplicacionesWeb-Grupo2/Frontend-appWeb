<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Sidebar from './components/Sidebar-components.vue';

const route = useRoute();
const { locale } = useI18n();

const isLoginPage = computed(() => route.name === 'Login');

const changeLanguage = (lang) => {
  locale.value = lang;
};
</script>

<template>
  <div v-if="!isLoginPage" class="app-layout">
    <Sidebar />
    <div class="main-wrapper">
      <router-view />
    </div>
  </div>

  <div v-else class="login-layout">
    <router-view />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f8fafc;
  color: #1a202c;
  overflow-x: hidden;
}

#app {
  width: 100%;
  min-height: 100vh;
}

.app-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

.main-wrapper {
  flex: 1;
  margin-left: 280px;
  min-height: 100vh;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: calc(100% - 280px);
}

@media (max-width: 768px) {
  .main-wrapper {
    margin-left: 80px;
    width: calc(100% - 80px);
  }
}

.login-layout {
  min-height: 100vh;
  width: 100%;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
