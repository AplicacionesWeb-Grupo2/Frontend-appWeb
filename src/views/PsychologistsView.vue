<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import axios from 'axios';

const { t } = useI18n();
const router = useRouter();
const API_URL = 'http://localhost:3000';

const psychologists = ref([]);
const loading = ref(true);

onMounted(async () => {
  await loadPsychologists();
});

const loadPsychologists = async () => {
  try {
    const response = await axios.get(`${API_URL}/psychologists`);
    psychologists.value = response.data;
  } catch (error) {
    console.error(t('errorLoadingPsychologists'), error);
  } finally {
    loading.value = false;
  }
};

const selectPsychologist = (psychologist) => {
  router.push({
    name: 'Agenda',
    query: {
      psychologistId: psychologist.id,
      openModal: 'true'
    }
  });
};

const viewProfile = (psychologist) => {
  router.push({
    name: 'PsychologistProfile',
    params: { id: psychologist.id }
  });
};
</script>

<template>
  <div class="psychologists-list-container">
    <div class="header">
      <h1 class="page-title">{{ t('chooseYourPsychologist') }}</h1>
      <p class="page-subtitle">
        {{ t('selectProfessional') }}
      </p>
    </div>

    <div v-if="loading" class="loading-state">
      <i class="pi pi-spin pi-spinner"></i>
      <p>{{ t('loadingPsychologists') }}</p>
    </div>

    <div v-else class="psychologists-grid">
      <div
          v-for="psych in psychologists"
          :key="psych.id"
          class="psychologist-card"
      >
        <div class="card-content">
          <div class="avatar-section">
            <img :src="psych.imagen" :alt="psych.nombre" class="avatar" />
            <div class="rating">
              <i class="pi pi-star-fill"></i>
              <span>{{ psych.calificacion }}</span>
            </div>
          </div>

          <div class="info-section">
            <h3 class="psychologist-name">{{ psych.nombre }}</h3>
            <p class="specialty">
              <i class="pi pi-bookmark"></i>
              {{ psych.especialidad }}
            </p>

            <div v-if="psych.proximosHorarios && psych.proximosHorarios.length > 0" class="availability">
              <span class="availability-label">
                <i class="pi pi-clock"></i>
                {{ t('nextAvailability') }}
              </span>
              <div class="next-slots">
                <span
                    v-for="(horario, index) in psych.proximosHorarios.slice(0, 2)"
                    :key="index"
                    class="slot-badge"
                >
                  {{ horario.dia.split(' ')[1] }} {{ horario.dia.split(' ')[2] }}
                </span>
              </div>
            </div>

            <p v-if="psych.descripcion" class="bio">
              {{ psych.descripcion }}
            </p>
          </div>
        </div>

        <div class="card-actions">
          <button
              @click="viewProfile(psych)"
              class="view-profile-button"
          >
            <i class="pi pi-user"></i>
            <span>{{ t('viewProfile') }}</span>
          </button>
          <button
              @click="selectPsychologist(psych)"
              class="select-button"
          >
            <span>{{ t('choosePsychologist') }}</span>
            <i class="pi pi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>

    <div v-if="!loading && psychologists.length === 0" class="empty-state">
      <i class="pi pi-users"></i>
      <h3>{{ t('noPsychologists') }}</h3>
      <p>{{ t('tryLater') }}</p>
    </div>
  </div>
</template>

<style scoped>
.psychologists-list-container {
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

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.75rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #667eea;
}

.loading-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.loading-state p {
  font-size: 1.1rem;
  color: #64748b;
}

.psychologists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 2rem;
}

.psychologist-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.psychologist-card:hover {
  transform: translateY(-2px);
  border-color: #667eea;
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.2);
}

.card-content {
  padding: 2rem;
  flex: 1;
}

.avatar-section {
  position: relative;
  text-align: center;
  margin-bottom: 1.5rem;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f1f5f9;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.rating {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 0.95rem;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.info-section {
  text-align: center;
}

.psychologist-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 1rem 0;
}

.specialty {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.specialty i {
  font-size: 1rem;
}

.availability {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.availability-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.next-slots {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.slot-badge {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #475569;
  font-weight: 600;
}

.bio {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
  margin: 1rem 0 0 0;
  text-align: left;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
  padding: 0 1.5rem 1.5rem 1.5rem;
}

.view-profile-button {
  flex: 1;
  padding: 1rem;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 0 0 0 18px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.view-profile-button:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.select-button {
  flex: 1;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0 0 18px 0;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.select-button:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  transform: translateY(-2px);
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: #94a3b8;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #64748b;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  font-size: 1rem;
  margin: 0;
}

@media (max-width: 768px) {
  .psychologists-list-container {
    padding: 1.5rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .psychologists-grid {
    grid-template-columns: 1fr;
  }
}
</style>
