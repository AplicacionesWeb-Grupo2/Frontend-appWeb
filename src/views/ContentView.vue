<script setup>
import { ref, onMounted } from 'vue';

const contents = ref([]);

onMounted(() => {
  // Ejemplo estático, puedes reemplazarlo con fetch a tu API
  contents.value = [
    { id: 1, title: 'Técnicas de relajación', type: 'video', url: 'https://www.youtube.com/watch?v=dbYCCb8tgSA' },
    { id: 2, title: 'Manejo de ansiedad', type: 'video', url: 'https://www.youtube.com/watch?v=2kUqVkYGI48' },
    { id: 3, title: 'Meditación guiada', type: 'video', url: 'https://www.youtube.com/watch?v=aBsnQjJ2_Nk' },
  ];
});
</script>

<template>
  <div class="content-container">
    <h1>🎥 Contenido educativo</h1>
    <div class="content-list">
      <div v-for="item in contents" :key="item.id" class="content-card">
        <h3>{{ item.title }}</h3>
        <p>Tipo: {{ item.type }}</p>
        <a :href="item.url" target="_blank">Ver {{ item.type }}</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-container {
  max-width: 900px;
  margin: 2rem auto;
  text-align: center;
}
.content-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}
.content-card {
  background: white;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  width: 250px;
  transition: transform 0.3s;
}
.content-card:hover {
  transform: translateY(-5px);
}
.content-card h3 {
  margin-bottom: 0.5rem;
  color: #003d91;
}
.content-card a {
  color: #0047ab;
  text-decoration: none;
  font-weight: 600;
}
.content-card a:hover {
  text-decoration: underline;
}
</style>
