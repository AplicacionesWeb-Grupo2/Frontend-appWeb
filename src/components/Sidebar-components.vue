<script setup>
import logoUrl from '../assets/icons/logo_EiraMind.png';
</script>

<template>
  <aside class="sidebar">
    <div class="logo-container">
      <div class="logo">
        <pv-Image :src="logoUrl" alt="EiraMind logo" class="logo-icon"/>
        <h2 class="logo-text">Eira<span class="logo-highlight">Mind</span></h2>
      </div>

      <nav class="main-nav">
        <router-link to="/">Inicio</router-link>
        <router-link to="/suscripciones">Paquetes</router-link>
        <router-link to="/agenda">Mensajes</router-link>
        <router-link to="/psicologos">Psicologos</router-link>
      </nav>
    </div>

    <div class="config">
      <router-link to="/configuracion">Configuracion</router-link>
    </div>
  </aside>
</template>

<style scoped>

.sidebar {
  background-color: white;
  /* Ancho más ajustado al ejemplo */
  width: 250px;
  /* Relleno superior e inferior para el espaciado vertical */
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  /* Mueve la configuración al fondo y el resto arriba */
  justify-content: space-between;
  /* Se mantiene el borde sutil */
  border-right: 1px solid #d8d8d8;
  /* Permite que el contenido interno se alinee y tenga su propio padding horizontal */
  box-sizing: border-box;
  /* Fuente de estilo predeterminado para todo el sidebar (asumiendo que es una sans-serif limpia) */
  font-family: Arial, sans-serif;
  height: 100vh; /* Asume que quieres que ocupe toda la altura de la vista */
}

/* Contenedor que agrupa el logo y la navegación, para que el `space-between` funcione
   solo con la Configuración */
.logo-container {
  display: flex;
  flex-direction: column;
  /* Ajusta el espacio entre el logo y los enlaces de navegación */
  gap: 3rem;
}

/* Estilos para el Logo */
.logo {
  display: flex;
  align-items: center;
  /* Espacio sutil entre el logo y el texto, como en la imagen */
  gap: 0.5rem;
  /* Padding horizontal para alinear con los enlaces */
  padding: 0 1.5rem;
  margin-bottom: 1.5rem; /* Espacio extra debajo del logo antes de la navegación */
}

.logo-icon {
  /* Fija el tamaño del componente contenedor si PrimeVue lo permite */
  width: 40px;
  height: 40px;
}

.logo img {
  /* Ajusta el tamaño del logo */
  width: 30px;
  height: 30px;
}

.logo-icon:deep(img) {
  width: 40px !important;
  height: 40px !important;
  object-fit: contain;
}

.logo-text {
  font-size: 1.5rem; /* Tamaño del título */
  font-weight: bolder; /* Un poco más audaz */
  color:  #003d91; /* Color oscuro para el texto principal */
  margin: 0;
  padding: 0;
}

.logo-highlight {
  /* Color turquesa/azul claro para la parte "Mind" */
  color: #4dc7e2;
  font-weight: bolder;
}


/* Estilos para la Navegación */
.main-nav {
  display: flex;
  flex-direction: column;
  /* Espaciado vertical entre los enlaces, más generoso que tu código original */
  gap: 1.8rem;
}

.main-nav a {
  text-decoration: none;
  /* Color de los enlaces */
  color: #1b1b1b;
  /* Peso normal a semi-negrita */
  font-weight: 500;
  /* Tamaño de fuente ligeramente más grande para parecerse al ejemplo */
  font-size: 1.1rem;
  /* Alineación y relleno a la izquierda para el efecto de la imagen */
  padding: 0 1.5rem;
}

/* El estilo para el enlace activo */
.main-nav a.router-link-active {
  color: #1b1b1b; /* En el ejemplo no parece haber un color distinto, pero puedes usar: #007bff; */
  /* Puedes añadir una sutil línea lateral o un cambio de fondo aquí si lo deseas */
}

/* Estilos para la Configuración */
.config {
  /* Padding horizontal para alinear con los enlaces */
  padding: 0 1.5rem;
}

.config a {
  text-decoration: none;
  /* Color oscuro para el texto de configuración */
  color: #1b1b1b;
  /* Fuente ligeramente más grande */
  font-size: 1.1rem;
  font-weight: 500;
}

</style>