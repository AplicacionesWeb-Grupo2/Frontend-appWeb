<template>
  <div class="psychologists-container">
    <!-- Header con navbar -->
    <header class="psychologists-header">
      <div class="logo-section">
        <img src="../assets/icons/logo_EiraMind.png" alt="EiraMind" class="logo" />
        <h1>Eira<span>Mind</span></h1>
      </div>
      <nav class="main-nav">
        <a href="#" class="nav-link">Psicologos en linea</a>
        <a href="#" class="nav-link">Precios</a>
        <a href="#" class="nav-link">FAQ</a>
        <a href="#" class="nav-link">Opiniones</a>
        <a href="#" class="nav-link">Mi cuenta</a>
      </nav>
    </header>

    <!-- Banner principal -->
    <div class="hero-banner">
      <h2>Conoce a nuestros psicologos</h2>
    </div>

    <!-- Contenido principal -->
    <div class="main-content">
      <h3 class="section-title">Elige a tu psicologo</h3>

      <!-- Loading state -->
      <div v-if="loading" class="loading">
        <i class="pi pi-spinner pi-spin"></i>
        <p>Cargando psicólogos...</p>
      </div>

      <!-- Lista de psicólogos -->
      <div v-else class="psychologists-grid">
        <div
            v-for="psychologist in psychologists"
            :key="psychologist.id"
            class="psychologist-card"
        >
          <div class="psychologist-info">
            <img
                :src="psychologist.imagen"
                :alt="psychologist.nombre"
                class="psychologist-avatar"
            />
            <div class="info-details">
              <h4>{{ psychologist.nombre }}</h4>
              <p class="specialty">Especialidad : {{ psychologist.especialidad }}</p>
              <a href="#" class="opinions-link">Ver opiniones</a>
              <div class="rating">
                <i
                    v-for="star in 5"
                    :key="star"
                    class="pi pi-star-fill"
                    :class="{ 'star-active': star <= psychologist.calificacion }"
                ></i>
              </div>
            </div>
          </div>

          <div class="schedule-section">
            <div
                v-for="(horario, index) in psychologist.proximosHorarios"
                :key="index"
                class="schedule-block"
            >
              <div class="schedule-header">
                <p class="schedule-title">Proximos horarios</p>
                <p class="schedule-date">{{ horario.dia }}</p>
              </div>
              <div class="time-slots">
                <button
                    v-for="hora in horario.horas"
                    :key="hora"
                    class="time-slot"
                    @click="selectAppointment(psychologist, horario, hora)"
                >
                  {{ hora }}
                </button>
              </div>
              <a href="#" class="more-hours">Ver más horas</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { authService } from '../services/authService';

const router = useRouter();
const psychologists = ref([]);
const loading = ref(true);

const loadPsychologists = async () => {
  try {
    const response = await axios.get('http://localhost:3000/psychologists');
    psychologists.value = response.data;
  } catch (error) {
    console.error('Error al cargar psicólogos:', error);
  } finally {
    loading.value = false;
  }
};

const selectAppointment = async (psychologist, horario, hora) => {
  const confirmed = confirm(
      `¿Confirmar cita con ${psychologist.nombre}?\n\nFecha: ${horario.dia}\nHora: ${hora}\nEspecialidad: ${psychologist.especialidad}`
  );

  if (!confirmed) return;

  try {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      alert('Debes iniciar sesión para agendar una cita');
      return;
    }

    const newAppointment = {
      userId: Number(currentUser.id),
      psychologistId: psychologist.id,
      psychologistName: psychologist.nombre,
      psychologistImage: psychologist.imagen,
      psychologistSpecialty: psychologist.especialidad,
      fecha: horario.fecha,
      hora: hora,
      estado: 'confirmada',
      createdAt: new Date().toISOString()
    };

    await axios.post('http://localhost:3000/appointments', newAppointment);

    alert(`¡Cita agendada exitosamente!\n\nPsicólogo: ${psychologist.nombre}\nFecha: ${horario.dia}\nHora: ${hora}\n\nPuedes ver tus citas en la sección "Psicólogos" del menú lateral.`);

    // Opcional: redirigir a la vista de psicólogos
    // router.push('/psicologos');
  } catch (error) {
    console.error('Error al agendar cita:', error);
    alert('Error al agendar la cita. Por favor intenta de nuevo.');
  }
};

onMounted(() => {
  loadPsychologists();
});
</script>

<style scoped>
.psychologists-container {
  min-height: 100vh;
  background-color: #e8f1fc;
}

/* Header */
.psychologists-header {
  background: white;
  padding: 1rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo {
  width: 40px;
  height: 40px;
}

.logo-section h1 {
  font-size: 1.5rem;
  color: #003d99;
  margin: 0;
}

.logo-section h1 span {
  color: #00bfff;
}

.main-nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #0047ab;
}

/* Hero Banner */
.hero-banner {
  background: linear-gradient(135deg, #d4e7f7 0%, #c5dff5 100%);
  padding: 4rem 3rem;
  text-align: center;
}

.hero-banner h2 {
  font-size: 2.5rem;
  color: #003d99;
  margin: 0;
  font-weight: 700;
}

/* Main Content */
.main-content {
  padding: 3rem;
  max-width: 1400px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.75rem;
  color: #333;
  margin-bottom: 2rem;
  font-weight: 600;
}

/* Loading */
.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.loading i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

/* Psychologists Grid */
.psychologists-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.psychologist-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.psychologist-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

/* Psychologist Info */
.psychologist-info {
  display: flex;
  gap: 1.5rem;
}

.psychologist-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e8f1fc;
}

.info-details h4 {
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.specialty {
  color: #666;
  margin: 0.5rem 0;
  font-size: 1rem;
}

.opinions-link {
  color: #0047ab;
  text-decoration: none;
  font-size: 0.9rem;
  display: inline-block;
  margin: 0.5rem 0;
}

.opinions-link:hover {
  text-decoration: underline;
}

.rating {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.75rem;
}

.rating i {
  color: #ddd;
  font-size: 1.5rem;
}

.rating i.star-active {
  color: #ffd700;
}

/* Schedule Section */
.schedule-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.schedule-block {
  background: #e8f1fc;
  border-radius: 12px;
  padding: 1.5rem;
}

.schedule-header {
  margin-bottom: 1rem;
}

.schedule-title {
  font-weight: 600;
  color: #333;
  margin: 0 0 0.25rem 0;
}

.schedule-date {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.time-slot {
  background: white;
  border: 2px solid #0047ab;
  color: #0047ab;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.time-slot:hover {
  background: #0047ab;
  color: white;
  transform: scale(1.05);
}

.more-hours {
  color: #0047ab;
  text-decoration: none;
  font-size: 0.9rem;
  text-align: center;
  display: block;
  margin-top: 0.5rem;
}

.more-hours:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 1024px) {
  .psychologist-card {
    grid-template-columns: 1fr;
  }

  .time-slots {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .psychologists-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .main-nav {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .hero-banner h2 {
    font-size: 1.75rem;
  }

  .main-content {
    padding: 1.5rem;
  }

  .psychologist-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .time-slots {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>