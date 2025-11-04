<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import { dateUtils } from '../utils/dateUtils';

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const API_URL = 'http://localhost:3000';

const psychologist = ref(null);
const loading = ref(true);

onMounted(async () => {
  await loadPsychologist();
});

const loadPsychologist = async () => {
  try {
    const response = await axios.get(`${API_URL}/psychologists/${route.params.id}`);
    psychologist.value = {
      ...response.data,
      proximosHorarios: dateUtils.getFutureDates(7)
    };
  } catch (error) {
    console.error('Error loading psychologist', error);
  } finally {
    loading.value = false;
  }
};

const scheduleAppointment = () => {
  router.push({
    name: 'Agenda',
    query: {
      psychologistId: psychologist.value.id,
      openModal: 'true'
    }
  });
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="profile-container">
    <button @click="goBack" class="back-button">
      <i class="pi pi-arrow-left"></i>
      {{ t('goBack') }}
    </button>

    <div v-if="loading" class="loading-state">
      <i class="pi pi-spin pi-spinner"></i>
      <p>{{ t('loadingProfile') }}</p>
    </div>

    <div v-else-if="psychologist" class="profile-content">
      <!-- Header Section -->
      <div class="profile-header">
        <div class="header-background" :style="{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }"></div>
        <div class="header-content">
          <div class="avatar-section">
            <img :src="psychologist.imagen" :alt="psychologist.nombre" class="profile-avatar" />
            <div class="rating-badge">
              <i class="pi pi-star-fill"></i>
              <span>{{ psychologist.calificacion }}/5</span>
            </div>
          </div>
          <div class="profile-info">
            <h1 class="profile-name">{{ psychologist.nombre }}</h1>
            <p class="profile-specialty">
              <i class="pi pi-bookmark"></i>
              {{ psychologist.especialidad }}
            </p>
            <div class="profile-stats">
              <div class="stat-item">
                <i class="pi pi-briefcase"></i>
                <span>{{ psychologist.anosExperiencia }} {{ t('yearsExperience') }}</span>
              </div>
              <div class="stat-item">
                <i class="pi pi-users"></i>
                <span>{{ psychologist.atendeEdades }}</span>
              </div>
            </div>
          </div>
          <button @click="scheduleAppointment" class="btn-schedule">
            <i class="pi pi-calendar-plus"></i>
            {{ t('scheduleAppointment') }}
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="profile-body">
        <div class="main-section">
          <!-- About -->
          <div class="info-card">
            <h2 class="card-title">
              <i class="pi pi-user"></i>
              {{ t('aboutPsychologist') }}
            </h2>
            <p class="biography">{{ psychologist.biografia }}</p>
          </div>

          <!-- Education -->
          <div class="info-card">
            <h2 class="card-title">
              <i class="pi pi-graduation-cap"></i>
              {{ t('education') }}
            </h2>
            <p class="education-text">{{ psychologist.educacion }}</p>
          </div>

          <!-- Certifications -->
          <div v-if="psychologist.certificaciones" class="info-card">
            <h2 class="card-title">
              <i class="pi pi-verified"></i>
              {{ t('certifications') }}
            </h2>
            <ul class="certifications-list">
              <li v-for="(cert, index) in psychologist.certificaciones" :key="index">
                <i class="pi pi-check-circle"></i>
                {{ cert }}
              </li>
            </ul>
          </div>

          <!-- Methodologies -->
          <div v-if="psychologist.metodologias" class="info-card">
            <h2 class="card-title">
              <i class="pi pi-book"></i>
              {{ t('therapeuticApproaches') }}
            </h2>
            <div class="tags-container">
              <span v-for="(metodologia, index) in psychologist.metodologias" :key="index" class="tag">
                {{ metodologia }}
              </span>
            </div>
          </div>

          <!-- Languages -->
          <div v-if="psychologist.idiomas" class="info-card">
            <h2 class="card-title">
              <i class="pi pi-globe"></i>
              {{ t('languages') }}
            </h2>
            <div class="tags-container">
              <span v-for="(idioma, index) in psychologist.idiomas" :key="index" class="tag">
                {{ idioma }}
              </span>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="sidebar-section">
          <!-- Availability -->
          <div class="availability-card">
            <h3>
              <i class="pi pi-clock"></i>
              {{ t('availability') }}
            </h3>
            <div class="availability-list">
              <div v-for="(horario, index) in psychologist.proximosHorarios.slice(0, 4)" :key="index" class="availability-item">
                <div class="date-label">{{ locale === 'es' ? horario.diaEs : horario.diaEn }}</div>
                <div class="time-slots">
                  <span v-for="(hora, idx) in horario.horas.slice(0, 3)" :key="idx" class="time-slot">
                    {{ hora }}
                  </span>
                </div>
              </div>
            </div>
            <button @click="scheduleAppointment" class="btn-view-all">
              {{ t('viewAllAvailability') }}
            </button>
          </div>

          <!-- Contact Info -->
          <div class="contact-card">
            <h3>
              <i class="pi pi-envelope"></i>
              {{ t('contact') }}
            </h3>
            <p class="contact-item">
              <i class="pi pi-at"></i>
              {{ psychologist.email }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="error-state">
      <i class="pi pi-exclamation-triangle"></i>
      <h3>{{ t('psychologistNotFound') }}</h3>
      <button @click="goBack" class="btn-back">{{ t('goBack') }}</button>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  color: #475569;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
}

.back-button:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateX(-4px);
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
}

.loading-state i,
.error-state i {
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 1rem;
}

.loading-state p,
.error-state h3 {
  font-size: 1.1rem;
  color: #64748b;
}

.profile-header {
  position: relative;
  margin-bottom: 3rem;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.header-background {
  height: 200px;
  width: 100%;
}

.header-content {
  background: white;
  padding: 2rem;
  position: relative;
  margin-top: -80px;
  display: flex;
  align-items: flex-end;
  gap: 2rem;
  flex-wrap: wrap;
}

.avatar-section {
  position: relative;
  flex-shrink: 0;
}

.profile-avatar {
  width: 160px;
  height: 160px;
  border-radius: 20px;
  object-fit: cover;
  border: 6px solid white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.rating-badge {
  position: absolute;
  bottom: -10px;
  right: -10px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.profile-info {
  flex: 1;
  min-width: 300px;
}

.profile-name {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a202c;
  margin: 0 0 0.75rem 0;
}

.profile-specialty {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.profile-stats {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 500;
}

.stat-item i {
  color: #667eea;
  font-size: 1.1rem;
}

.btn-schedule {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  align-self: flex-start;
}

.btn-schedule:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(102, 126, 234, 0.4);
}

.profile-body {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
}

.main-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s ease;
}

.info-card:hover {
  border-color: #667eea;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.1);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 1.5rem 0;
}

.card-title i {
  color: #667eea;
  font-size: 1.5rem;
}

.biography,
.education-text {
  font-size: 1rem;
  line-height: 1.8;
  color: #475569;
  margin: 0;
}

.certifications-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.certifications-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: #475569;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #10b981;
}

.certifications-list i {
  color: #10b981;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #475569;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 600;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.tag:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.availability-card,
.contact-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  padding: 1.5rem;
}

.availability-card h3,
.contact-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 1.5rem 0;
}

.availability-card h3 i,
.contact-card h3 i {
  color: #667eea;
}

.availability-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.availability-item {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
}

.date-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.75rem;
}

.time-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.time-slot {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #475569;
  font-weight: 600;
}

.btn-view-all {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-view-all:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #475569;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 10px;
  margin: 0;
}

.contact-item i {
  color: #667eea;
  font-size: 1.1rem;
}

.btn-back {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.btn-back:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

@media (max-width: 1024px) {
  .profile-body {
    grid-template-columns: 1fr;
  }

  .sidebar-section {
    order: -1;
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 1.5rem;
  }

  .header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .profile-name {
    font-size: 2rem;
  }

  .profile-stats {
    justify-content: center;
  }

  .btn-schedule {
    width: 100%;
    justify-content: center;
  }
}
</style>
