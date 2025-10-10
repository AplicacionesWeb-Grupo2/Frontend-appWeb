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
  width: 120px;
  height: 120px;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: #1b1b1b;
  transition: transform 0.2s;
}

.card:hover {
  transform: scale(1.05);
}
.icon {
  font-size: 2rem;
}
</style>