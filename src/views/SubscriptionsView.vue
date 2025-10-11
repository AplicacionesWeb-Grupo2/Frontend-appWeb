<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { subscriptionService } from '../services/subscriptionService';
import SubscriptionCard from '../components/SubscriptionCard-components.vue';

const { t } = useI18n();
const plans = ref([]);

onMounted(() => {
  plans.value = subscriptionService.getPlans();
});

function handleSubscribe(plan) {
  alert(`✅ ${t('subscriptions.card.choose')}: ${plan.name}`);
}
</script>

<template>
  <div class="subscriptions-container">
    <header class="header-section">
      <h1 v-html="t('subscriptions.header.title')"></h1>
      <p v-html="t('subscriptions.header.subtitle')"></p>
    </header>

    <div class="plans-grid">
      <div
          v-for="plan in plans"
          :key="plan.id"
          class="plan-card"
          :class="`plan-${plan.id}`"
      >
        <h2>{{ plan.name }}</h2>
        <p class="price">{{ plan.price }}</p>
        <ul>
          <li v-for="(feature, i) in plan.features" :key="i">
            ✅ {{ feature }}
          </li>
        </ul>
        <button @click="handleSubscribe(plan)">{{ t('subscriptions.card.choose') }}</button>
      </div>
    </div>

    <footer class="footer-section">
      <p>{{ t('subscriptions.footer') }}</p>
    </footer>
  </div>
</template>

<style scoped>
/* CONTENEDOR GENERAL */
.subscriptions-container {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #eef3ff, #dfe8ff);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 1rem;
  font-family: 'Poppins', sans-serif;
}

/* HEADER */
.header-section {
  text-align: center;
  margin-bottom: 3rem;
  max-width: 700px;
}

.header-section h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #003d91;
  margin-bottom: 0.5rem;
}

.header-section p {
  font-size: 1.1rem;
  color: #4a4a4a;
}

/* GRID DE PLANES */
.plans-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  max-width: 1000px;
}

/* CARD BASE */
.plan-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  width: 300px;
  text-align: center;
  transition: all 0.3s ease;
  transform: translateY(0);
}

.plan-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
}

/* DIFERENTES COLORES POR PLAN */
.plan-1 {
  background: linear-gradient(145deg, #ffffff, #f6f8ff);
  border-top: 6px solid #a0aec0;
}

.plan-2 {
  background: linear-gradient(145deg, #e0e7ff, #c7d2fe);
  border-top: 6px solid #4f46e5;
  color: #1e1b4b;
}

.plan-3 {
  background: linear-gradient(145deg, #ede9fe, #c4b5fd);
  border-top: 6px solid #7c3aed;
  color: #2e1065;
}

/* TEXTO DENTRO DE LA CARD */
.plan-card h2 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.price {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

/* LISTA DE BENEFICIOS */
.plan-card ul {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
}

.plan-card li {
  margin: 0.3rem 0;
  font-size: 0.95rem;
}

/* BOTÓN */
button {
  background-color: #003d91;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background-color: #004fc7;
}

/* FOOTER */
.footer-section {
  margin-top: 3rem;
  text-align: center;
  color: #555;
  font-size: 1rem;
}
</style>
