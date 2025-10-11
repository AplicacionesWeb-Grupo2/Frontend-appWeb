<script setup>
defineProps({
  icon: String,
  title: String,
  route: String
});
</script>

<template>
  <router-link :to="route" class="card">
    <div class="icon">{{ icon }}</div>
    <h3>{{ title }}</h3>
  </router-link>
</template>

<style scoped>
.card {
  background: white;
  width: 140px;
  height: 140px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: #003d91;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.icon {
  font-size: 2.5rem;
  margin-bottom: 8px;
}
</style>
