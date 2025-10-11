<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const setLanguage = (lang) => {
  locale.value = lang;
};
</script>

<template>
  <div class="language-switcher">
    <button
        :class="{ active: locale === 'es' }"
        @click="setLanguage('es')"
    >
      Español
    </button>
    <button
        :class="{ active: locale === 'en' }"
        @click="setLanguage('en')"
    >
      English
    </button>
  </div>
</template>

<style scoped>
.language-switcher {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ccc;
  background-color: white;
  z-index: 1000;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.language-switcher button {
  flex: 1;
  padding: 0.4rem 0.8rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  color: #555;
}

.language-switcher button.active {
  background-color: #003d91;
  color: white;
}

.language-switcher button:not(.active):hover {
  background-color: #f0f0f0;
}
</style>
