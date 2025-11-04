<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService';
const { t, locale } = useI18n();
const router = useRouter();
const user = ref(null);
onMounted(() => {
  user.value = authService.getCurrentUser();
});
const changeLanguage = (lang) => {
  locale.value = lang;
};
const cards = [
  {
    icon: '',
    title: 'subscriptions',
    route: '/suscripciones',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#667eea'
  },
  {
    icon: '',
    title: 'schedule',
    route: '/agenda',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: '#f093fb'
  },
  {
    icon: '✅',
    title: 'tasks',
    route: '/tareas',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: '#4facfe'
  },
  {
    icon: '',
    title: 'content',
    route: '/contenido',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    color: '#43e97b'
  }
];
</script>
<template>
  <div class="home-container">
    <!-- Header with language switcher -->
    <div class="top-bar">
      <div class="welcome-section">
        <h1 class="welcome-title">{{ t('greeting') }}</h1>
        <p class="welcome-subtitle">{{ t('welcomeMessage') }}</p>
      </div>

      <div class="language-switcher">
        <button
            @click="changeLanguage('es')"
            :class="{ active: locale === 'es' }"
            class="lang-btn"
        >
          Español
        </button>
        <button
            @click="changeLanguage('en')"
            :class="{ active: locale === 'en' }"
            class="lang-btn"
        >
          English
        </button>
      </div>
    </div>
    <!-- Alert Card -->
    <div class="alert-card">
      <div class="alert-icon">⚠ </div>
      <div class="alert-content">
        <h3 class="alert-title">{{ t('noPackage') }}</h3>
        <p class="alert-description">{{ t('packageMessage') }}</p>
      </div>
      <button class="alert-btn" @click="router.push('/suscripciones')">
        {{ t('ctaButton') }}
      </button>
    </div>
    <!-- Main Cards Grid -->
    <div class="cards-grid">
      <router-link
          v-for="(card, index) in cards"
          :key="card.title"
          :to="card.route"
          class="dashboard-card"
          :class="`card-${index}`"
      >
        <div class="card-icon" :style="{ background: card.gradient }">
          {{ card.icon }}
        </div>
        <h3 class="card-title">{{ t(card.title) }}</h3>
        <div class="card-arrow">→</div>
      </router-link>
    </div>
    <!-- Appointment Flow Section -->
    <div class="appointment-section">
      <h2 class="section-title">{{ t('scheduleTitle') }}</h2>

      <div class="steps-container">
        <div class="step-card">
          <div class="step-number">1</div>
          <h3 class="step-title">{{ t('step1') }}</h3>
        </div>

        <div class="step-arrow">→</div>

        <div class="step-card">
          <div class="step-number">2</div>
          <h3 class="step-title">{{ t('step2') }}</h3>
        </div>

        <div class="step-arrow">→</div>

        <div class="step-card">
          <div class="step-number">3</div>
          <h3 class="step-title">{{ t('step3') }}</h3>
        </div>
      </div>
      <button class="cta-button" @click="router.push('/psicologos')">
        {{ t('choosePsychologist') }}
      </button>
    </div>
  </div>
</template>
<style scoped>
.home-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 3rem 2rem;
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e8f4f8 100%);
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* Top Bar */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;
  gap: 2rem;
}
.welcome-section {
  flex: 1;
}
.welcome-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #1a202c;
  margin: 0 0 0.75rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
}
.welcome-subtitle {
  font-size: 1.3rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}
/* Language Switcher */
.language-switcher {
  display: flex;
  gap: 0.5rem;
  background: white;
  padding: 0.25rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.lang-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}
.lang-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
.lang-btn:hover:not(.active) {
  background: #f1f5f9;
  color: #475569;
}
/* Alert Card */
.alert-card {
  background: linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%);
  border: 2px solid #ffb84d;
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 8px 24px rgba(255, 184, 77, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.alert-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(255, 184, 77, 0.2);
}
.alert-icon {
  font-size: 3rem;
  flex-shrink: 0;
}
.alert-content {
  flex: 1;
}
.alert-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}
.alert-description {
  font-size: 1rem;
  color: #4a5568;
  margin: 0;
}
.alert-btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
}
.alert-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(249, 115, 22, 0.4);
}
/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}
.dashboard-card {
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
}
.dashboard-card::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
}
/* Colores específicos para cada tarjeta */

.card-0::before {
  background: linear-gradient(135deg, #667eea 0%, transparent 100%);
}
.card-0:hover {
  border-color: #667eea;
}
.card-0 .card-arrow {
  color: #667eea;
}
.card-1::before {
  background: linear-gradient(135deg, #f093fb 0%, transparent 100%);
}
.card-1:hover {
  border-color: #f093fb;
}
.card-1 .card-arrow {
  color: #f093fb;
}
.card-2::before {
  background: linear-gradient(135deg, #4facfe 0%, transparent 100%);
}
.card-2:hover {
  border-color: #4facfe;
}
.card-2 .card-arrow {
  color: #4facfe;
}
.card-3::before {
  background: linear-gradient(135deg, #43e97b 0%, transparent 100%);
}
.card-3:hover {
  border-color: #43e97b;
}
.card-3 .card-arrow {
  color: #43e97b;
}
.dashboard-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
}
.dashboard-card:hover::before {
  opacity: 0.05;
}
.card-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.4s ease;
}
.dashboard-card:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
}
.card-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.card-arrow {
  position: absolute;
  top: 2rem;
  right: 2rem;
  font-size: 1.5rem;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.4s ease;
}
.dashboard-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(0);
}
/* Appointment Section */
.appointment-section {
  background: white;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}
.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  text-align: center;
  margin: 0 0 2.5rem 0;
}
.steps-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}
.step-card {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  border: 2px solid #38bdf8;
  border-radius: 20px;
  padding: 2rem;
  flex: 1;
  min-width: 200px;
  max-width: 280px;
  text-align: center;
  transition: all 0.3s ease;
}
.step-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(56, 189, 248, 0.3);
}
.step-number {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.3);
}
.step-title {
  font-size: 1rem;
  font-weight: 600;
  color: #0c4a6e;
  margin: 0;
  line-height: 1.4;
}
.step-arrow {
  font-size: 2rem;
  color: #38bdf8;
  font-weight: bold;
}
.cta-button {
  display: block;
  margin: 0 auto;
  padding: 1.25rem 3rem;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(14, 165, 233, 0.4);
}
/* Responsive Design */
@media (max-width: 768px) {
  .home-container {
    padding: 1.5rem;
  }
  .top-bar {
    flex-direction: column;
    gap: 1.5rem;
  }
  .welcome-title {
    font-size: 2rem;
  }
  .language-switcher {
    width: 100%;
  }
  .lang-btn {
    flex: 1;
  }
  .alert-card {
    flex-direction: column;
    text-align: center;
  }
  .alert-btn {
    width: 100%;
  }
  .cards-grid {
    grid-template-columns: 1fr;
  }
  .steps-container {
    flex-direction: column;
  }
  .step-arrow {
    transform: rotate(90deg);
  }
  .appointment-section {
    padding: 2rem 1.5rem;
  }
}
</style>