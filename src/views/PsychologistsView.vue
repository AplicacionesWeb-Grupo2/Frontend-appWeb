<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { psychologistService } from '../services/psychologistService';

const { t } = useI18n();
const router = useRouter();

const psychologists = ref([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  await loadPsychologists();
});

const loadPsychologists = async () => {
  try {
    console.log('🔄 TEST: Iniciando carga de psicólogos...');
    loading.value = true;
    error.value = '';

    // 1. Primero probar el servicio directamente
    console.log('🔍 Llamando a psychologistService.getAllPsychologists()');

    const data = await psychologistService.getAllPsychologists();
    console.log('📦 Datos recibidos del servicio:', data);
    console.log('📊 Tipo de datos:', typeof data);
    console.log('🔢 Cantidad:', Array.isArray(data) ? data.length : 'No es array');

    if (Array.isArray(data) && data.length > 0) {
      psychologists.value = data;
      console.log('✅ Datos asignados a psychologists:', psychologists.value);
    } else {
      console.warn('⚠️ Datos vacíos o no es array');
      error.value = 'No se encontraron psicólogos';
    }

  } catch (err) {
    console.error('❌ ERROR en loadPsychologists:', err);
    error.value = 'Error: ' + err.message;

    // Forzar datos de prueba
    psychologists.value = [
      {
        id: "1",
        nombre: "TEST Psicólogo",
        especialidad: "Test Especialidad",
        calificacion: 5,
        imagen: "https://i.pravatar.cc/150?img=1",
        descripcion: "Descripción de prueba",
        proximosHorarios: [
          {
            fecha: "2024-10-22",
            dia: "Hoy",
            horas: ["10:00", "14:00"]
          }
        ]
      }
    ];
    console.log('🎭 Usando datos de prueba:', psychologists.value);

  } finally {
    loading.value = false;
    console.log('🏁 Carga completada. Loading:', loading.value);
    console.log('👥 Psicólogos en estado:', psychologists.value);
  }
};

const selectPsychologist = (psychologist) => {
  console.log('🎯 Psicólogo seleccionado:', psychologist);
  router.push({
    name: 'Agenda',
    query: {
      psychologistId: psychologist.id,
      openModal: 'true'
    }
  });
};

const viewProfile = (psychologist) => {
  console.log('👤 Viendo perfil de:', psychologist.nombre);
  router.push({
    name: 'PsychologistProfile',
    params: { id: psychologist.id }
  });
};

// Datos mock para desarrollo
const getMockPsychologists = () => {
  console.log('🎭 Usando datos mock para desarrollo');
  return [
    {
      id: "1",
      nombre: "Alberto Salas",
      especialidad: "violencia, ansiedad",
      calificacion: 5,
      imagen: "https://i.pravatar.cc/150?img=12",
      descripcion: "Especialista en terapia cognitivo-conductual con 10 años de experiencia trabajando con pacientes con ansiedad y estrés.",
      proximosHorarios: [
        {
          fecha: "2024-10-22",
          dia: "Martes 22 octubre",
          horas: ["10:00", "18:00", "20:00", "22:00"]
        },
        {
          fecha: "2024-10-23",
          dia: "Miércoles 23 octubre",
          horas: ["09:00", "14:00", "16:00", "21:00"]
        }
      ]
    },
    {
      id: "2",
      nombre: "Beatriz Montalvo",
      especialidad: "depresión, autoestima",
      calificacion: 4,
      imagen: "https://i.pravatar.cc/150?img=45",
      descripcion: "Psicóloga clínica enfocada en terapia humanista y desarrollo personal.",
      proximosHorarios: [
        {
          fecha: "2024-10-22",
          dia: "Martes 22 octubre",
          horas: ["11:00", "15:00", "19:00"]
        }
      ]
    }
  ];
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

    <!-- Mensaje de error -->
    <div v-if="error" class="error-state">
      <i class="pi pi-exclamation-triangle"></i>
      <h3>{{ error }}</h3>
      <p>Mostrando datos de ejemplo para desarrollo...</p>
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
                  {{ horario.dia ? horario.dia.split(' ')[1] + ' ' + horario.dia.split(' ')[2] : 'Próxima semana' }}
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
/* Tus estilos actuales se mantienen igual */
.psychologists-list-container {
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

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #1a202c;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
}

.page-subtitle {
  font-size: 1.3rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

.error-state {
  background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
  border: 2px solid #fc8181;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #c53030;
}

.error-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.error-state h3 {
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
}

.error-state p {
  font-size: 0.9rem;
  margin: 0;
  color: #742a2a;
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
  border: 2px solid rgba(102, 126, 234, 0.1);
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
}

.psychologist-card:hover {
  transform: translateY(-8px);
  border-color: #667eea;
  box-shadow: 0 24px 60px rgba(102, 126, 234, 0.25);
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
