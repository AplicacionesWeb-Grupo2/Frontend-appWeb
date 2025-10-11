<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService';
import CardOption from '../components/CardOption-components.vue';

const router = useRouter();
const userName = ref('Usuario');

onMounted(() => {
  const user = authService.getUser();
  if (user && user.nombre) {
    userName.value = user.nombre;
  }
});

function goToPsychologists() {
  router.push('/psicologos');
}
</script>

<template>
  <div class="home">
    <h1>¡Saludos, {{ userName }}!</h1>
    <div class="banner">
      <p>
        Aún no tienes un paquete activo. Compra uno y ahorra hasta un 10% en tus próximas citas.
      </p>
    </div>

    <div class="options">
      <CardOption icon="🔔" title="Suscripciones" route="/suscripciones" />
      <CardOption icon="📅" title="Agenda" route="/agenda" />
      <CardOption icon="📝" title="Tareas" route="/tareas" />
      <CardOption icon="🎥" title="Contenido" route="/contenido" />
    </div>

    <section class="appointment">
      <h2>Agenda tu cita</h2>
      <div class="steps">
        <div>1️⃣ Elige al psicólogo ideal</div>
        <div>2️⃣ Agenda tu cita</div>
        <div>3️⃣ Inicia la sesión de terapia</div>
      </div>
      <button @click="goToPsychologists">Elegir Psicólogo</button>

      <div class="footer-links">
        <a href="#">Aviso de privacidad</a>
        <span> | </span>
        <a href="#">Términos y condiciones</a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
}
.banner {
  background-color: #003d91;
  color: white;
  padding: 1rem;
  margin: 1rem auto;
  border-radius: 10px;
  max-width: 600px;
}
.options {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 1.5rem;
}
.appointment {
  margin-top: 2rem;
}
.steps {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
}
button {
  background-color: #003d91;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}
button:hover {
  background-color: #0050c7;
}
.footer-links {
  margin-top: 1.5rem;
  color: #555;
}
.footer-links a {
  color: #003d91;
  text-decoration: none;
}
.footer-links a:hover {
  text-decoration: underline;
}
</style>
