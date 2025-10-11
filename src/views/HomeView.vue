<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { authService } from '../services/authService';
import CardOption from '../components/CardOption-components.vue';
import Chatbot from '../components/ChatBot-components.vue';

const router = useRouter();
const { t } = useI18n();
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
    <h1> {{t('home.greeting')}} {{ userName }}!</h1>

    <div class="banner">
      <p>{{ t('home.banner') }}</p>
    </div>

    <div class="options">
      <CardOption icon="🔔" :title="t('home.cards.subscriptions')" route="/suscripciones" />
      <CardOption icon="📅" :title="t('home.cards.agenda')" route="/agenda" />
      <CardOption icon="📝" :title="t('home.cards.tasks')" route="/tareas" />
      <CardOption icon="🎥" :title="t('home.cards.content')" route="/contenido" />
    </div>

    <section class="appointment">
      <h2>{{ t('home.appointment.title') }}</h2>
      <div class="steps">
        <div>1️⃣ {{ t('home.appointment.steps.1')}}</div>
        <div>2️⃣ {{ t('home.appointment.steps.2')}}</div>
        <div>3️⃣ {{ t('home.appointment.steps.3')}}</div>
      </div>
      <button @click="goToPsychologists">{{ t('home.appointment.button') }}</button>

      <div class="footer-links">
        <a href="#">{{ t('home.footer.privacy') }}</a>
        <span> | </span>
        <a href="#">{{ t('home.footer.terms') }}</a>
      </div>
    </section>

    <!-- 👇 Chatbot flotante, solo visible en Home -->
    <Chatbot />
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
