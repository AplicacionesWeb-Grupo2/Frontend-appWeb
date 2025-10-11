<script setup>
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();
</script>

<template>
  <select v-model="locale" class="language-switcher">
    <option value="es">Español</option>
    <option value="en">English</option>
  </select>
</template>

<style scoped>
.language-switcher {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: 1px solid #1a1a1a;
  background-color: #1e1b4b;
  color: #333;
  font-weight: 500;
  cursor: pointer;
}
.language-switcher option {
  color: #333;
}
</style>
