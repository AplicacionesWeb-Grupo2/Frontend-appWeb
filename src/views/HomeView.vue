<script setup>
import { useRouter } from 'vue-router';
import CardOption from '../components/CardOption-components.vue';

const router = useRouter();

function goToPsychologists() {
  router.push('/psicologos');
}
</script>

<template>
  <div class="home">
    <h1>¡Saludos User!</h1>
    <div class="banner-container">
      <div class="banner">
        <p>
          Aún no tienes un paquete activo. Compra uno y ahorra hasta un 10% en tus próximas citas.
        </p>
      </div>
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
    </section>


    <section class="appointment">
      <h2>Agenda tu cita</h2>
      <div class="steps-container">
        <div class="step-card">
          <img :src="iconPaso1" alt="Elige psicólogo" class="step-icon">
          <p>1️⃣ Elige al psicólogo ideal</p>
        </div>
        <div class="step-card">
          <img :src="iconPaso2" alt="Agenda tu cita" class="step-icon">
          <p>2️⃣ Agenda tu cita</p>
        </div>
        <div class="step-card">
          <img :src="iconPaso3" alt="Inicia la sesión" class="step-icon">
          <p>3️⃣ Inicia la sesión de terapia</p>
        </div>
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
}

.banner {
  background-color: #003d91;
  color: white;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 10px;
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
  background-color:  #003d91;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background-color: #0050c7;
}
</style>