<script setup>
import logoUrl from '../assets/icons/logo_EiraMind.png';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService';

const router = useRouter();

const logout = () => {
  authService.logout();
  router.push('/login');
};
</script>

<template>
  <aside class="sidebar">
    <div class="logo-container">
      <div class="logo">
        <pv-Image :src="logoUrl" alt="EiraMind logo" class="logo-icon" />
        <h2 class="logo-text">Eira<span class="logo-highlight">Mind</span></h2>
      </div>

      <nav class="main-nav">
        <router-link to="/">Inicio</router-link>
        <router-link to="/suscripciones">Paquetes</router-link>
        <router-link to="/agenda">Calendario</router-link>
        <router-link to="/psicologos">Psicólogos</router-link>
      </nav>
    </div>

    <div class="config">
      <router-link to="/configuracion">Configuración</router-link>
    </div>
    <button @click="logout" class="logout-btn">
      <i class="pi pi-sign-out"></i> Cerrar Sesión
    </button>
  </aside>
</template>

<style scoped>
.sidebar {
  background-color: white;
  width: 250px;
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid #d8d8d8;
  font-family: Arial, sans-serif;
  height: 100vh;
}

.logo-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1.5rem;
  margin-bottom: 1.5rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
}

.logo-icon:deep(img) {
  width: 40px !important;
  height: 40px !important;
  object-fit: contain;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: bolder;
  color: #003d91;
}

.logo-highlight {
  color: #4dc7e2;
}

.main-nav {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.main-nav a {
  text-decoration: none;
  color: #1b1b1b;
  font-weight: 500;
  font-size: 1.1rem;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
}

.main-nav a:hover {
  background: #f0f7ff;
  color: #003d91;
}

.main-nav a.router-link-active {
  background: #e6f0ff;
  font-weight: 600;
  color: #003d91;
}

.config {
  padding: 0 1.5rem;
}

.logout-btn {
  margin: 1rem;
  background: none;
  border: none;
  color: #003d91;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logout-btn:hover {
  color: #007bff;
}
</style>
