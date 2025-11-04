<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import axios from 'axios';

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
const API_URL = 'http://localhost:3000';

const psychologists = ref([]);
const appointments = ref([]);
const showModal = ref(false);
const showEditModal = ref(false);
const editingAppointment = ref(null);

const newAppointment = ref({
  psychologistId: null,
  date: '',
  time: '',
  notes: ''
});

onMounted(async () => {
  await Promise.all([loadPsychologists(), loadAppointments()]);

  if (route.query.psychologistId && route.query.openModal === 'true') {
    newAppointment.value.psychologistId = route.query.psychologistId;
    showModal.value = true;
    router.replace({ name: 'Agenda' });
  }
});

const loadPsychologists = async () => {
  try {
    const response = await axios.get(`${API_URL}/psychologists`);
    psychologists.value = response.data;
  } catch (error) {
    console.error(t('errorLoadingPsychologists'), error);
  }
};

const loadAppointments = async () => {
  try {
    const response = await axios.get(`${API_URL}/appointments`);
    appointments.value = response.data;
  } catch (error) {
    console.error(t('errorLoadingAppointments'), error);
  }
};

// Función para obtener la imagen del psicólogo
const getPsychologistImage = (psychologistId) => {
  const psychologist = psychologists.value.find(p => p.id === psychologistId);
  return psychologist?.imagen || 'https://i.pravatar.cc/150?img=1';
};

const selectedPsychologist = computed(() => {
  if (!newAppointment.value.psychologistId) return null;
  return psychologists.value.find(p => p.id === newAppointment.value.psychologistId);
});

const availableDates = computed(() => {
  if (!selectedPsychologist.value) return [];
  return selectedPsychologist.value.proximosHorarios || [];
});

const availableTimes = computed(() => {
  if (!newAppointment.value.date) return [];
  const schedule = availableDates.value.find(d => d.fecha === newAppointment.value.date);
  return schedule?.horas || [];
});

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  newAppointment.value = {
    psychologistId: null,
    date: '',
    time: '',
    notes: ''
  };
};

const confirmAppointment = async () => {
  if (!newAppointment.value.psychologistId || !newAppointment.value.date || !newAppointment.value.time) {
    alert(t('fillRequiredFields'));
    return;
  }

  try {
    const psychologist = psychologists.value.find(p => p.id === newAppointment.value.psychologistId);
    const appointmentData = {
      psychologistId: newAppointment.value.psychologistId,
      psychologistName: psychologist.nombre,
      date: newAppointment.value.date,
      time: newAppointment.value.time,
      notes: newAppointment.value.notes,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    await axios.post(`${API_URL}/appointments`, appointmentData);
    alert(t('appointmentScheduled'));
    await loadAppointments();
    closeModal();
  } catch (error) {
    console.error(t('errorSchedulingAppointment'), error);
    alert(t('appointmentScheduleError'));
  }
};

// NUEVA FUNCIÓN: Eliminar cita
const deleteAppointment = async (appointmentId) => {
  if (!confirm(t('cancelAppointmentConfirm'))) {
    return;
  }

  try {
    await axios.delete(`${API_URL}/appointments/${appointmentId}`);
    alert(t('appointmentCanceled'));
    await loadAppointments();
  } catch (error) {
    console.error(t('errorCancelingAppointment'), error);
    alert(t('appointmentCancelError'));
  }
};

// NUEVA FUNCIÓN: Abrir modal de edición
const openEditModal = (appointment) => {
  editingAppointment.value = { ...appointment };
  showEditModal.value = true;
};

// NUEVA FUNCIÓN: Cerrar modal de edición
const closeEditModal = () => {
  showEditModal.value = false;
  editingAppointment.value = null;
};

// NUEVA FUNCIÓN: Guardar cambios de edición
const saveEditedAppointment = async () => {
  if (!editingAppointment.value.date || !editingAppointment.value.time) {
    alert(t('fillRequiredFields'));
    return;
  }

  try {
    await axios.put(`${API_URL}/appointments/${editingAppointment.value.id}`, editingAppointment.value);
    alert(t('appointmentModified'));
    await loadAppointments();
    closeEditModal();
  } catch (error) {
    console.error(t('errorModifyingAppointment'), error);
    alert(t('appointmentModifyError'));
  }
};

const formatDate = (dateString) => {
  if (!dateString || dateString === 'Invalid Date') return t('dateNotAvailable');
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return t('invalidDate');
  return date.toLocaleDateString(locale.value === 'es' ? 'es-ES' : 'en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

const changeLanguage = (lang) => {
  locale.value = lang;
};
</script>

<template>
  <div class="agenda-container">
    <!-- Header -->
    <div class="agenda-header">
      <div class="header-content">
        <h1 class="page-title">{{ t('mySchedule') }}</h1>
        <p class="page-subtitle">{{ t('manageAppointments') }}</p>
      </div>

      <div class="header-actions">
        <select :value="locale" @change="changeLanguage($event.target.value)" class="lang-select">
          <option value="es">{{ t('spanish') }}</option>
          <option value="en">{{ t('english') }}</option>
        </select>

        <button @click="openModal" class="btn-new-appointment">
          <i class="pi pi-plus"></i>
          <span>{{ t('scheduleNewAppointment') }}</span>
        </button>
      </div>
    </div>

    <!-- Appointments List -->
    <div class="appointments-section">
      <h2 class="section-title">
        <i class="pi pi-calendar"></i>
        {{ t('upcomingAppointments') }}
      </h2>

      <div v-if="appointments.length === 0" class="empty-state">
        <i class="pi pi-calendar"></i>
        <h3>{{ t('noAppointments') }}</h3>
        <p>{{ t('scheduleFirstAppointment') }}</p>
        <button @click="openModal" class="btn-empty-state">
          <i class="pi pi-plus"></i>
          {{ t('scheduleAppointment') }}
        </button>
      </div>

      <div v-else class="appointments-grid">
        <div v-for="appointment in appointments" :key="appointment.id" class="appointment-card">
          <div class="appointment-header">
            <div class="psychologist-avatar">
              <img
                  :src="getPsychologistImage(appointment.psychologistId)"
                  :alt="appointment.psychologistName"
                  class="psychologist-photo"
              />
          </div>
            <div class="appointment-info">
              <h3>{{ appointment.psychologistName }}</h3>
              <span class="status-badge confirmed">{{ t('confirmed') }}</span>
            </div>
          </div>

          <div class="appointment-details">
            <div class="detail-item">
              <i class="pi pi-calendar"></i>
              <span>{{ formatDate(appointment.date) }}</span>
            </div>
            <div class="detail-item">
              <i class="pi pi-clock"></i>
              <span>{{ appointment.time }}</span>
            </div>
            <div v-if="appointment.notes" class="detail-item notes">
              <i class="pi pi-file-edit"></i>
              <span>{{ appointment.notes }}</span>
            </div>
          </div>

          <div class="appointment-actions">
            <button @click="openEditModal(appointment)" class="btn-action">
              <i class="pi pi-pencil"></i>
              {{ t('modify') }}
            </button>
            <button @click="deleteAppointment(appointment.id)" class="btn-action danger">
              <i class="pi pi-trash"></i>
              {{ t('cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Crear Cita -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title-section">
              <i class="pi pi-calendar"></i>
              <h2>{{ t('scheduleNewAppointment') }}</h2>
            </div>
            <button @click="closeModal" class="close-btn">
              <i class="pi pi-times"></i>
            </button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">
                <i class="pi pi-user"></i>
                {{ t('selectPsychologist') }}
              </label>
              <select v-model="newAppointment.psychologistId" class="form-select">
                <option :value="null" disabled>{{ t('choosePsychologistPlaceholder') }}</option>
                <option
                    v-for="psych in psychologists"
                    :key="psych.id"
                    :value="psych.id"
                >
                  {{ psych.nombre }} - {{ psych.especialidad }}
                </option>
              </select>
            </div>

            <div v-if="selectedPsychologist" class="form-group">
              <label class="form-label">
                <i class="pi pi-calendar"></i>
                {{ t('date') }}
              </label>
              <select v-model="newAppointment.date" class="form-select">
                <option value="" disabled>{{ t('selectDate') }}</option>
                <option
                    v-for="schedule in availableDates"
                    :key="schedule.fecha"
                    :value="schedule.fecha"
                >
                  {{ schedule.dia }}
                </option>
              </select>
            </div>

            <div v-if="newAppointment.date" class="form-group">
              <label class="form-label">
                <i class="pi pi-clock"></i>
                {{ t('time') }}
              </label>
              <div class="time-grid">
                <button
                    v-for="time in availableTimes"
                    :key="time"
                    @click="newAppointment.time = time"
                    :class="{ selected: newAppointment.time === time }"
                    class="time-slot"
                    type="button"
                >
                  {{ time }}
                </button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="pi pi-file-edit"></i>
                {{ t('notesOptional') }}
              </label>
              <textarea
                  v-model="newAppointment.notes"
                  class="form-textarea"
                  :placeholder="t('notesPlaceholder')"
                  rows="4"
              ></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="closeModal" class="btn-cancel">
              {{ t('cancel') }}
            </button>
            <button @click="confirmAppointment" class="btn-confirm">
              <i class="pi pi-check"></i>
              {{ t('confirmAppointment') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Editar Cita -->
    <Teleport to="body">
      <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title-section">
              <i class="pi pi-pencil"></i>
              <h2>{{ t('modifyAppointment') }}</h2>
            </div>
            <button @click="closeEditModal" class="close-btn">
              <i class="pi pi-times"></i>
            </button>
          </div>

          <div v-if="editingAppointment" class="modal-body">
            <div class="form-group">
              <label class="form-label">
                <i class="pi pi-user"></i>
                {{ t('psychologist') }}
              </label>
              <input
                  :value="editingAppointment.psychologistName"
                  class="form-select"
                  disabled
                  style="background: #f1f5f9; cursor: not-allowed;"
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="pi pi-calendar"></i>
                {{ t('newDate') }}
              </label>
              <input
                  v-model="editingAppointment.date"
                  type="date"
                  class="form-select"
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="pi pi-clock"></i>
                {{ t('newTime') }}
              </label>
              <input
                  v-model="editingAppointment.time"
                  type="time"
                  class="form-select"
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="pi pi-file-edit"></i>
                {{ t('notes') }}
              </label>
              <textarea
                  v-model="editingAppointment.notes"
                  class="form-textarea"
                  :placeholder="t('notesPlaceholder')"
                  rows="4"
              ></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="closeEditModal" class="btn-cancel">
              {{ t('cancel') }}
            </button>
            <button @click="saveEditedAppointment" class="btn-confirm">
              <i class="pi pi-check"></i>
              {{ t('saveChanges') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.agenda-container {
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

.agenda-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  gap: 2rem;
  flex-wrap: wrap;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
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
  border-color: #667eea;
}

.btn-new-appointment {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-new-appointment:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.appointments-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
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
  color: #667eea;
  font-size: 1.75rem;
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
  margin: 0 0 2rem 0;
}

.btn-empty-state {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
}

.btn-empty-state:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.appointments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.appointment-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.appointment-card:hover {
  border-color: #667eea;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.appointment-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.psychologist-avatar {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
  overflow: hidden;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.psychologist-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


.appointment-info {
  flex: 1;
}

.appointment-info h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}

.status-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.confirmed {
  background: #d1fae5;
  color: #065f46;
}

.appointment-details {
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  color: #475569;
}

.detail-item i {
  color: #94a3b8;
  font-size: 1rem;
}

.detail-item.notes {
  color: #64748b;
  font-style: italic;
  background: white;
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.appointment-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-action {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 10px;
  background: white;
  color: #475569;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-action:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
}

.btn-action.danger:hover {
  background: #fee2e2;
  color: #dc2626;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  animation: fadeIn 0.2s ease;
}

.modal {
  background: white;
  border-radius: 24px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 2px solid #f1f5f9;
}

.modal-title-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-title-section i {
  color: #667eea;
  font-size: 1.5rem;
}

.modal-title-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.close-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #f1f5f9;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #64748b;
  font-size: 1.2rem;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #475569;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.form-label i {
  color: #667eea;
  font-size: 1rem;
}

.form-select,
.form-textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  color: #1a202c;
  background: white;
  transition: all 0.3s ease;
}

.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
}

.time-slot {
  padding: 0.875rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  color: #475569;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.time-slot:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.time-slot.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 2px solid #f1f5f9;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-cancel {
  background: #f1f5f9;
  color: #64748b;
}

.btn-cancel:hover {
  background: #e2e8f0;
  color: #475569;
}

.btn-confirm {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

@media (max-width: 768px) {
  .agenda-container {
    padding: 1.5rem;
  }

  .agenda-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    font-size: 2rem;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .btn-new-appointment,
  .lang-select {
    width: 100%;
  }

  .appointments-grid {
    grid-template-columns: 1fr;
  }

  .modal {
    max-height: 95vh;
  }
}
</style>
