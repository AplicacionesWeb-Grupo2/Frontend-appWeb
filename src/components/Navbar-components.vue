<script setup></script>

<template>
  <pv-Toolbar class="shadow-2 surface-ground px-4 py-2 flex justify-between">
    <div class="flex align-items-center gap-4">
      <h2 class="text-2xl font-bold text-primary">EiraMind</h2>
      <router-link to="/">Inicio</router-link>
      <router-link to="/about">Nosotros</router-link>
    </div>
    <div>
      <pv-Button label="Ingresar" icon="pi pi-user" class="p-button-rounded p-button-primary" />
    </div>
  </pv-Toolbar>
</template>

<style scoped>
a {
  color: #333;
  text-decoration: none;
  transition: color 0.2s;
}
a:hover {
  color: #003d91;
}
</style>
