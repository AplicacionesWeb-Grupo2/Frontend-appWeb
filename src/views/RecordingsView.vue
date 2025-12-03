<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import axios from 'axios';

const { t, locale } = useI18n();
const API_URL = 'https://app-eiramind.azurewebsites.net/api';

const recordings = ref([]);
const loading = ref(true);
const selectedRecording = ref(null);
const showVideoModal = ref(false);
const filterStatus = ref('all');
const searchQuery = ref('');

onMounted(async () => {
  await loadRecordings();
});

const loadRecordings = async () => {
  try {
    const response = await axios.get(`${API_URL}/recordings`);
    recordings.value = response.data;
  } catch (error) {
    console.error('Error cargando grabaciones:', error);
  } finally {
    loading.value = false;
  }
};

const filteredRecordings = computed(() => {
  let filtered = recordings.value;

  if (filterStatus.value === 'watched') {
    filtered = filtered.filter(r => r.watched);
  } else if (filterStatus.value === 'unwatched') {
    filtered = filtered.filter(r => !r.watched);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(r =>
        r.psychologistName.toLowerCase().includes(query) ||
        r.sessionTopic.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const openVideo = (recording) => {
  selectedRecording.value = recording;
  showVideoModal.value = true;
  markAsWatched(recording.id);
};

const closeVideo = () => {
  showVideoModal.value = false;
  selectedRecording.value = null;
};

const markAsWatched = async (id) => {
  try {
    const recording = recordings.value.find(r => r.id === id);
    if (recording && !recording.watched) {
      await axios.patch(`${API_URL}/recordings/${id}`, { watched: true });
      recording.watched = true;
    }
  } catch (error) {
    console.error('Error marcando como visto:', error);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
};

const downloadRecording = (recording) => {
  alert(`Descargando: ${recording.sessionTopic}`);
};

const changeLanguage = (lang) => {
  locale.value = lang;
};
</script>

<template>
  <div class="recordings-container">
    <div class="recordings-header">
      <div class="header-content">
        <h1 class="page-title">Mis Grabaciones</h1>
        <p class="page-subtitle">
          Revive tus sesiones de terapia y consulta tus avances
        </p>
      </div>

      <div class="header-actions">
        <div class="language-selector">
          <select :value="locale" @change="changeLanguage($event.target.value)" class="lang-select">
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>

    <div class="controls-bar">
      <div class="search-box">
        <i class="pi pi-search"></i>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por psicólogo o tema..."
            class="search-input"
        />
      </div>

      <div class="filter-tabs">
        <button
            @click="filterStatus = 'all'"
            :class="{ active: filterStatus === 'all' }"
            class="filter-tab"
        >
          Todas ({{ recordings.length }})
        </button>
        <button
            @click="filterStatus = 'unwatched'"
            :class="{ active: filterStatus === 'unwatched' }"
            class="filter-tab"
        >
          Sin ver ({{ recordings.filter(r => !r.watched).length }})
        </button>
        <button
            @click="filterStatus = 'watched'"
            :class="{ active: filterStatus === 'watched' }"
            class="filter-tab"
        >
          Vistas ({{ recordings.filter(r => r.watched).length }})
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <i class="pi pi-spin pi-spinner"></i>
      <p>Cargando grabaciones...</p>
    </div>

    <div v-else-if="filteredRecordings.length > 0" class="recordings-grid">
      <div
          v-for="recording in filteredRecordings"
          :key="recording.id"
          class="recording-card"
      >
        <div class="recording-thumbnail" @click="openVideo(recording)">
          <img :src="recording.thumbnail" :alt="recording.sessionTopic" />
          <div class="play-overlay">
            <i class="pi pi-play"></i>
          </div>
          <div class="duration-badge">{{ formatDuration(recording.duration) }}</div>
          <div v-if="!recording.watched" class="new-badge">Nuevo</div>
        </div>

        <div class="recording-info">
          <h3 class="recording-title">{{ recording.sessionTopic }}</h3>

          <div class="recording-meta">
            <div class="meta-item">
              <i class="pi pi-user"></i>
              <span>{{ recording.psychologistName }}</span>
            </div>
            <div class="meta-item">
              <i class="pi pi-calendar"></i>
              <span>{{ formatDate(recording.date) }}</span>
            </div>
          </div>

          <p class="recording-description">{{ recording.description }}</p>

          <div class="recording-actions">
            <button @click="openVideo(recording)" class="btn-primary">
              <i class="pi pi-play"></i>
              Ver sesión
            </button>
            <button @click="downloadRecording(recording)" class="btn-secondary">
              <i class="pi pi-download"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <i class="pi pi-video"></i>
      <h3>No hay grabaciones disponibles</h3>
      <p>Tus sesiones grabadas aparecerán aquí después de cada cita</p>
    </div>

    <Teleport to="body">
      <div v-if="showVideoModal" class="modal-overlay" @click.self="closeVideo">
        <div class="video-modal">
          <div class="modal-header">
            <div class="modal-title-section">
              <h2>{{ selectedRecording?.sessionTopic }}</h2>
              <p>{{ selectedRecording?.psychologistName }} • {{ formatDate(selectedRecording?.date) }}</p>
            </div>
            <button @click="closeVideo" class="close-btn">
              <i class="pi pi-times"></i>
            </button>
          </div>

          <div class="modal-body">
            <div class="video-player">
              <video controls class="video-element">
                <source :src="selectedRecording?.videoUrl" type="video/mp4">
                Tu navegador no soporta el elemento de video.
              </video>
            </div>

            <div class="session-notes">
              <h3><i class="pi pi-file-edit"></i> Notas de la sesión</h3>
              <p>{{ selectedRecording?.notes || 'No hay notas disponibles para esta sesión.' }}</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.recordings-container {
  max-width: 1600px;
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

.recordings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;
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

.controls-bar {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 300px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-box i {
  position: absolute;
  left: 1rem;
  color: #94a3b8;
  font-size: 1.1rem;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  background: white;
  padding: 0.25rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filter-tab {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #64748b;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filter-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.filter-tab:hover:not(.active) {
  background: #f1f5f9;
  color: #475569;
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

.recordings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.recording-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.recording-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.recording-thumbnail {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  cursor: pointer;
}

.recording-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recording-card:hover .recording-thumbnail img {
  transform: scale(1.05);
}

.play-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.recording-thumbnail:hover .play-overlay {
  opacity: 1;
}

.play-overlay i {
  font-size: 3rem;
  color: white;
}

.duration-badge {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.new-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #ef4444;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
}

.recording-info {
  padding: 1.5rem;
}

.recording-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 1rem 0;
  line-height: 1.3;
}

.recording-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #64748b;
}

.meta-item i {
  color: #94a3b8;
}

.recording-description {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
}

.recording-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #f1f5f9;
  color: #64748b;
  padding: 0.75rem 1rem;
}

.btn-secondary:hover {
  background: #e2e8f0;
  color: #475569;
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

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  animation: fadeIn 0.2s ease;
}

.video-modal {
  background: white;
  border-radius: 20px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
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
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #f1f5f9;
}

.modal-title-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}

.modal-title-section p {
  font-size: 0.95rem;
  color: #64748b;
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
  padding: 0;
}

.video-player {
  background: #000;
  width: 100%;
  aspect-ratio: 16/9;
}

.video-element {
  width: 100%;
  height: 100%;
}

.session-notes {
  padding: 2rem;
}

.session-notes h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 1rem 0;
}

.session-notes p {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .recordings-container {
    padding: 1.5rem;
  }

  .recordings-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    font-size: 2rem;
  }

  .controls-bar {
    flex-direction: column;
  }

  .search-box {
    min-width: 100%;
  }

  .filter-tabs {
    width: 100%;
    justify-content: space-between;
  }

  .recordings-grid {
    grid-template-columns: 1fr;
  }

  .video-modal {
    max-height: 95vh;
  }
}
</style>
