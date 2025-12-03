<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService';
import { appointmentService } from '../services/appointmentService';

const { t, locale } = useI18n();
const router = useRouter();

const user = ref(null);
const appointments = ref([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  user.value = authService.getCurrentUser();
  console.log('👤 Usuario actual:', user.value);

  if (user.value?.userType !== 'psychologist') {
    router.push('/');
    return;
  }

  await loadAppointments();
});

const loadAppointments = async () => {
  try {
    console.log('📅 Cargando citas...');
    loading.value = true;
    error.value = '';

    // Aquí necesitarías implementar appointmentService
    // Por ahora, usar datos mock
    appointments.value = getMockAppointments();

    console.log(`✅ Citas cargadas: ${appointments.value.length}`);

  } catch (err) {
    console.error('❌ Error cargando citas:', err);
    error.value = 'Error cargando las citas';
    appointments.value = getMockAppointments();
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale.value === 'es' ? 'es-ES' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const changeLanguage = (lang) => {
  locale.value = lang;
};

// Datos mock para citas
const getMockAppointments = () => {
  return [
    {
      id: "1",
      psychologistId: "1",
      psychologistName: "Alberto Salas",
      patientId: "1",
      patientName: "Juan Pérez",
      date: "2024-10-25",
      time: "10:00",
      notes: "Consulta inicial sobre ansiedad",
      status: "confirmed",
      createdAt: "2024-10-20T10:00:00.000Z"
    },
    {
      id: "2",
      psychologistId: "1",
      psychologistName: "Alberto Salas",
      patientId: "2",
      patientName: "María García",
      date: "2024-10-26",
      time: "14:00",
      notes: "Seguimiento terapia",
      status: "pending",
      createdAt: "2024-10-21T14:30:00.000Z"
    }
  ];
};
</script>

<template>
  <div class="psychologist-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="page-title">{{ t('welcomePsychologist') }}</h1>
        <p class="page-subtitle">{{ t('yourAppointments') }}</p>
      </div>

      <div class="header-info">
        <div class="psychologist-info">
          <div class="avatar">
            <img
                :src="user?.imagen || 'https://i.pravatar.cc/150'"
                :alt="user?.nombre"
                class="avatar-img"
            />
          </div>
          <div class="info-text">
            <h3>{{ user?.nombre }}</h3>
            <p>{{ user?.especialidad }}</p>
          </div>
        </div>

        <select :value="locale" @change="changeLanguage($event.target.value)" class="lang-select">
          <option value="es">{{ t('spanish') }}</option>
          <option value="en">{{ t('english') }}</option>
        </select>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <i class="pi pi-calendar"></i>
        </div>
        <div class="stat-content">
          <h3>{{ appointments.length }}</h3>
          <p>{{ t('totalAppointments') }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
          <i class="pi pi-check-circle"></i>
        </div>
        <div class="stat-content">
          <h3>{{ appointments.filter(a => a.status === 'confirmed').length }}</h3>
          <p>{{ t('confirmed') }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
          <i class="pi pi-clock"></i>
        </div>
        <div class="stat-content">
          <h3>{{ appointments.filter(a => new Date(a.date) > new Date()).length }}</h3>
          <p>{{ t('upcoming') }}</p>
        </div>
      </div>
    </div>

    <!-- Appointments List -->
    <div class="appointments-section">
      <h2 class="section-title">
        <i class="pi pi-list"></i>
        {{ t('appointmentsList') }}
      </h2>

      <div v-if="loading" class="loading">
        <i class="pi pi-spin pi-spinner"></i>
        <p>{{ t('loading') }}</p>
      </div>

      <div v-else-if="appointments.length === 0" class="empty-state">
        <i class="pi pi-calendar"></i>
        <h3>{{ t('noAppointments') }}</h3>
        <p>{{ t('noAppointmentsPsychologist') }}</p>
      </div>

      <div v-else class="appointments-table">
        <div class="table-header">
          <div class="table-cell">{{ t('patientName') }}</div>
          <div class="table-cell">{{ t('date') }}</div>
          <div class="table-cell">{{ t('time') }}</div>
          <div class="table-cell">{{ t('status') }}</div>
          <div class="table-cell">{{ t('notes') }}</div>
        </div>

        <div v-for="appointment in appointments" :key="appointment.id" class="table-row">
          <div class="table-cell patient-cell">
            <div class="patient-avatar">
              <i class="pi pi-user"></i>
            </div>
            <span>{{ appointment.patientName || 'Paciente' }}</span>
          </div>
          <div class="table-cell">{{ formatDate(appointment.date) }}</div>
          <div class="table-cell">{{ appointment.time }}</div>
          <div class="table-cell">
            <span :class="`status-badge ${appointment.status}`">
              {{ appointment.status === 'confirmed' ? t('confirmed') : t('pending') }}
            </span>
          </div>
          <div class="table-cell notes-cell">
            {{ appointment.notes || '-' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.psychologist-dashboard {
  max-width: 1600px;
  margin: 0 auto;
  padding: 3rem 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8 0%, #e8eff5 100%);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  gap: 2rem;
  flex-wrap: wrap;
  background: white;
  padding: 2rem;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #2c3e50 0%, #4a6491 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.75rem 0;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

.header-info {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.psychologist-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  background: #f8fafc;
  border-radius: 16px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-text h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.25rem 0;
}

.info-text p {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
}

.lang-select {
  padding: 0.75rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #475569;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lang-select:hover {
  border-color: #2c3e50;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.75rem;
}

.stat-content h3 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a202c;
  margin: 0 0 0.25rem 0;
  line-height: 1;
}

.stat-content p {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

.appointments-section {
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 2rem 0;
}

.section-title i {
  color: #2c3e50;
  font-size: 1.75rem;
}

.loading {
  text-align: center;
  padding: 4rem 2rem;
  color: #94a3b8;
}

.loading i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #cbd5e1;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #94a3b8;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #cbd5e1;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #64748b;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  font-size: 1rem;
  margin: 0;
}

.appointments-table {
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #f1f5f9;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 0.8fr 0.8fr 1.5fr;
  background: #2c3e50;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 0.8fr 0.8fr 1.5fr;
  border-bottom: 1px solid #f1f5f9;
  background: white;
  transition: background 0.3s ease;
}

.table-row:hover {
  background: #f8fafc;
}

.table-cell {
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  font-size: 0.95rem;
}

.patient-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.patient-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.status-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.confirmed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.notes-cell {
  color: #64748b;
  font-style: italic;
}

@media (max-width: 1024px) {
  .appointments-table {
    overflow-x: auto;
  }

  .table-header,
  .table-row {
    min-width: 800px;
  }
}

@media (max-width: 768px) {
  .psychologist-dashboard {
    padding: 1.5rem;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    font-size: 2rem;
  }

  .header-info {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .appointments-section {
    padding: 1.5rem;
  }
}
</style>
