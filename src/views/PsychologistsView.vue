<template>
  <div class="psychologists-view">
    <h1>Mis Psicólogos</h1>
    <p class="subtitle">Aquí puedes ver los psicólogos con los que has agendado citas</p>

    <!-- Loading state -->
    <div v-if="loading" class="loading">
      <i class="pi pi-spinner pi-spin"></i>
      <p>Cargando tus citas...</p>
    </div>

    <!-- No appointments -->
    <div v-else-if="appointments.length === 0" class="no-appointments">
      <i class="pi pi-calendar-times"></i>
      <h3>No tienes citas agendadas</h3>
      <p>Agenda tu primera cita con un psicólogo</p>
      <button @click="$router.push('/elegir-psicologo')" class="btn-primary">
        Elegir Psicólogo
      </button>
    </div>

    <!-- Appointments list -->
    <div v-else class="appointments-container">
      <div
          v-for="appointment in appointments"
          :key="appointment.id"
          class="appointment-card"
      >
        <div class="appointment-header">
          <div class="psychologist-info">
            <img
                :src="appointment.psychologistImage"
                :alt="appointment.psychologistName"
                class="psychologist-avatar"
            />
            <div class="info">
              <h3>{{ appointment.psychologistName }}</h3>
              <p class="specialty">{{ appointment.psychologistSpecialty }}</p>
            </div>
          </div>
          <span
              class="status-badge"
              :class="appointment.estado"
          >
            {{ appointment.estado === 'confirmada' ? 'Confirmada' : 'Pendiente' }}
          </span>
        </div>

        <div class="appointment-details">
          <div class="detail-item">
            <i class="pi pi-calendar"></i>
            <div>
              <p class="detail-label">Fecha</p>
              <p class="detail-value">{{ formatDate(appointment.fecha) }}</p>
            </div>
          </div>
          <div class="detail-item">
            <i class="pi pi-clock"></i>
            <div>
              <p class="detail-label">Hora</p>
              <p class="detail-value">{{ appointment.hora }}</p>
            </div>
          </div>
        </div>

        <div class="appointment-actions">
          <button
              @click="viewDetails(appointment)"
              class="btn-secondary"
          >
            <i class="pi pi-eye"></i>
            Ver detalles
          </button>
          <button
              @click="cancelAppointment(appointment.id)"
              class="btn-danger"
          >
            <i class="pi pi-times"></i>
            Cancelar cita
          </button>
          <button
              v-if="isToday(appointment.fecha)"
              @click="startSession(appointment)"
              class="btn-success"
          >
            <i class="pi pi-video"></i>
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div v-if="appointments.length > 0" class="quick-actions">
      <button @click="$router.push('/elegir-psicologo')" class="btn-primary">
        <i class="pi pi-plus"></i>
        Agendar nueva cita
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { authService } from '../services/authService';
import axios from 'axios';

const appointments = ref([]);
const loading = ref(true);

const loadAppointments = async () => {
  try {
    const currentUser = authService.getCurrentUser();
    console.log('Usuario actual:', currentUser);

    if (!currentUser) {
      console.log('No hay usuario logueado');
      return;
    }

    const response = await axios.get('http://localhost:3000/appointments');
    console.log('Todas las citas:', response.data);

    // Filtrar solo las citas del usuario actual
    appointments.value = response.data.filter(
        appointment => appointment.userId === Number(currentUser.id) || appointment.userId === currentUser.id
    );

    console.log('Citas del usuario:', appointments.value);

    // Ordenar por fecha y hora
    appointments.value.sort((a, b) => {
      const dateA = new Date(`${a.fecha} ${a.hora}`);
      const dateB = new Date(`${b.fecha} ${b.hora}`);
      return dateA - dateB;
    });
  } catch (error) {
    console.error('Error al cargar citas:', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
};

const isToday = (dateString) => {
  const today = new Date();
  const appointmentDate = new Date(dateString);
  return today.toDateString() === appointmentDate.toDateString();
};

const viewDetails = (appointment) => {
  alert(`Detalles de la cita con ${appointment.psychologistName}\nFecha: ${formatDate(appointment.fecha)}\nHora: ${appointment.hora}`);
};

const cancelAppointment = async (appointmentId) => {
  if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) return;

  try {
    await axios.delete(`http://localhost:3000/appointments/${appointmentId}`);
    appointments.value = appointments.value.filter(app => app.id !== appointmentId);
    alert('Cita cancelada exitosamente');
  } catch (error) {
    console.error('Error al cancelar cita:', error);
    alert('Error al cancelar la cita');
  }
};

const startSession = (appointment) => {
  alert(`Iniciando sesión con ${appointment.psychologistName}...`);
  // Aquí puedes agregar la lógica para iniciar la videollamada
};

onMounted(() => {
  loadAppointments();
});
</script>

<style scoped>
.psychologists-view {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #003d99;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  margin-bottom: 2rem;
}

/* Loading */
.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.loading i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #0047ab;
}

/* No appointments */
.no-appointments {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.no-appointments i {
  font-size: 4rem;
  color: #ccc;
  margin-bottom: 1rem;
}

.no-appointments h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.no-appointments p {
  color: #666;
  margin-bottom: 2rem;
}

/* Appointments container */
.appointments-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.appointment-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.appointment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

/* Appointment header */
.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.psychologist-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.psychologist-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e8f1fc;
}

.info h3 {
  color: #333;
  margin: 0 0 0.25rem 0;
  font-size: 1.25rem;
}

.specialty {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
}

.status-badge.confirmada {
  background: #d4edda;
  color: #155724;
}

.status-badge.pendiente {
  background: #fff3cd;
  color: #856404;
}

/* Appointment details */
.appointment-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.detail-item i {
  font-size: 1.5rem;
  color: #0047ab;
}

.detail-label {
  color: #999;
  font-size: 0.85rem;
  margin: 0 0 0.25rem 0;
  text-transform: uppercase;
}

.detail-value {
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

/* Appointment actions */
.appointment-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Buttons */
button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #0047ab 0%, #003d99 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 71, 171, 0.3);
}

.btn-secondary {
  background: white;
  color: #0047ab;
  border: 2px solid #0047ab;
}

.btn-secondary:hover {
  background: #0047ab;
  color: white;
}

.btn-danger {
  background: white;
  color: #dc3545;
  border: 2px solid #dc3545;
}

.btn-danger:hover {
  background: #dc3545;
  color: white;
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #20893a 100%);
  color: white;
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
}

/* Quick actions */
.quick-actions {
  margin-top: 2rem;
  text-align: center;
}

.quick-actions button {
  display: inline-flex;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .appointment-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .appointment-actions {
    flex-direction: column;
  }

  .appointment-actions button {
    width: 100%;
    justify-content: center;
  }
}
</style>