<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import { authService } from '../services/authService';

const { t, locale } = useI18n();
const router = useRouter();
const API_URL = 'http://localhost:3000';

const user = ref(null);
const editMode = ref(false);
const loading = ref(true);
const saving = ref(false);

const editedUser = ref({
  nombre: '',
  email: '',
  dni: '',
  telefono: '',
  direccion: '',
  fechaNacimiento: '',
  genero: '',
  ciudad: '',
  pais: ''
});

onMounted(async () => {
  await loadUserProfile();
});

const loadUserProfile = async () => {
  try {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const response = await axios.get(`${API_URL}/users/${currentUser.id}`);
    user.value = response.data;

    // Initialize editedUser with current user data
    editedUser.value = {
      nombre: user.value.nombre || '',
      email: user.value.email || '',
      dni: user.value.dni || '',
      telefono: user.value.telefono || '',
      direccion: user.value.direccion || '',
      fechaNacimiento: user.value.fechaNacimiento || '',
      genero: user.value.genero || '',
      ciudad: user.value.ciudad || '',
      pais: user.value.pais || ''
    };
  } catch (error) {
    console.error('Error loading user profile', error);
  } finally {
    loading.value = false;
  }
};

const toggleEditMode = () => {
  if (editMode.value) {
    // Cancel edit - restore original values
    editedUser.value = {
      nombre: user.value.nombre || '',
      email: user.value.email || '',
      dni: user.value.dni || '',
      telefono: user.value.telefono || '',
      direccion: user.value.direccion || '',
      fechaNacimiento: user.value.fechaNacimiento || '',
      genero: user.value.genero || '',
      ciudad: user.value.ciudad || '',
      pais: user.value.pais || ''
    };
  }
  editMode.value = !editMode.value;
};

const saveProfile = async () => {
  if (!editedUser.value.nombre || !editedUser.value.email) {
    alert(t('fillRequiredFields'));
    return;
  }

  saving.value = true;
  try {
    const currentUser = authService.getCurrentUser();
    const updatedData = {
      ...user.value,
      ...editedUser.value
    };

    await axios.put(`${API_URL}/users/${currentUser.id}`, updatedData);
    user.value = updatedData;
    editMode.value = false;
    alert(t('profileUpdated'));
  } catch (error) {
    console.error('Error updating profile', error);
    alert(t('profileUpdateError'));
  } finally {
    saving.value = false;
  }
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const changeLanguage = (lang) => {
  locale.value = lang;
};
</script>

<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1 class="page-title">{{ t('myProfile') }}</h1>
      <div class="header-actions">
        <select :value="locale" @change="changeLanguage($event.target.value)" class="lang-select">
          <option value="es">{{ t('spanish') }}</option>
          <option value="en">{{ t('english') }}</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <i class="pi pi-spin pi-spinner"></i>
      <p>{{ t('loadingProfile') }}</p>
    </div>

    <div v-else-if="user" class="profile-content">
      <!-- Profile Card -->
      <div class="profile-card">
        <div class="avatar-section">
          <div class="avatar">
            {{ getInitials(user.nombre) }}
          </div>
          <div class="user-basic-info">
            <h2 class="user-name">{{ user.nombre }}</h2>
            <p class="user-email">{{ user.email }}</p>
            <span class="user-type">{{ t('patient') }}</span>
          </div>
        </div>

        <div class="profile-actions">
          <button v-if="!editMode" @click="toggleEditMode" class="btn-edit">
            <i class="pi pi-pencil"></i>
            {{ t('editProfile') }}
          </button>
          <template v-else>
            <button @click="toggleEditMode" class="btn-cancel">
              <i class="pi pi-times"></i>
              {{ t('cancel') }}
            </button>
            <button @click="saveProfile" :disabled="saving" class="btn-save">
              <i class="pi pi-check"></i>
              {{ saving ? t('saving') : t('saveChanges') }}
            </button>
          </template>
        </div>
      </div>

      <!-- Profile Information -->
      <div class="info-section">
        <div class="info-card">
          <h3 class="card-title">
            <i class="pi pi-user"></i>
            {{ t('personalInformation') }}
          </h3>

          <div class="info-grid">
            <div class="info-item">
              <label class="info-label">
                <i class="pi pi-user"></i>
                {{ t('fullName') }}
              </label>
              <input
                  v-if="editMode"
                  v-model="editedUser.nombre"
                  type="text"
                  class="info-input"
                  :placeholder="t('enterFullName')"
              />
              <p v-else class="info-value">{{ user.nombre || '-' }}</p>
            </div>

            <div class="info-item">
              <label class="info-label">
                <i class="pi pi-id-card"></i>
                {{ t('dni') }}
              </label>
              <input
                  v-if="editMode"
                  v-model="editedUser.dni"
                  type="text"
                  class="info-input"
                  :placeholder="t('enterDNI')"
              />
              <p v-else class="info-value">{{ user.dni || '-' }}</p>
            </div>

            <div class="info-item">
              <label class="info-label">
                <i class="pi pi-calendar"></i>
                {{ t('birthDate') }}
              </label>
              <input
                  v-if="editMode"
                  v-model="editedUser.fechaNacimiento"
                  type="date"
                  class="info-input"
              />
              <p v-else class="info-value">{{ user.fechaNacimiento || '-' }}</p>
            </div>

            <div class="info-item">
              <label class="info-label">
                <i class="pi pi-venus-mars"></i>
                {{ t('gender') }}
              </label>
              <select
                  v-if="editMode"
                  v-model="editedUser.genero"
                  class="info-input"
              >
                <option value="">{{ t('selectGender') }}</option>
                <option value="Masculino">{{ t('male') }}</option>
                <option value="Femenino">{{ t('female') }}</option>
                <option value="Otro">{{ t('other') }}</option>
                <option value="Prefiero no decir">{{ t('preferNotToSay') }}</option>
              </select>
              <p v-else class="info-value">{{ user.genero || '-' }}</p>
            </div>
          </div>
        </div>

        <div class="info-card">
          <h3 class="card-title">
            <i class="pi pi-phone"></i>
            {{ t('contactInformation') }}
          </h3>

          <div class="info-grid">
            <div class="info-item">
              <label class="info-label">
                <i class="pi pi-envelope"></i>
                {{ t('email') }}
              </label>
              <input
                  v-if="editMode"
                  v-model="editedUser.email"
                  type="email"
                  class="info-input"
                  :placeholder="t('enterEmail')"
              />
              <p v-else class="info-value">{{ user.email }}</p>
            </div>

            <div class="info-item">
              <label class="info-label">
                <i class="pi pi-phone"></i>
                {{ t('phone') }}
              </label>
              <input
                  v-if="editMode"
                  v-model="editedUser.telefono"
                  type="tel"
                  class="info-input"
                  :placeholder="t('enterPhone')"
              />
              <p v-else class="info-value">{{ user.telefono || '-' }}</p>
            </div>

            <div class="info-item full-width">
              <label class="info-label">
                <i class="pi pi-map-marker"></i>
                {{ t('address') }}
              </label>
              <input
                  v-if="editMode"
                  v-model="editedUser.direccion"
                  type="text"
                  class="info-input"
                  :placeholder="t('enterAddress')"
              />
              <p v-else class="info-value">{{ user.direccion || '-' }}</p>
            </div>

            <div class="info-item">
              <label class="info-label">
                <i class="pi pi-building"></i>
                {{ t('city') }}
              </label>
              <input
                  v-if="editMode"
                  v-model="editedUser.ciudad"
                  type="text"
                  class="info-input"
                  :placeholder="t('enterCity')"
              />
              <p v-else class="info-value">{{ user.ciudad || '-' }}</p>
            </div>

            <div class="info-item">
              <label class="info-label">
                <i class="pi pi-globe"></i>
                {{ t('country') }}
              </label>
              <input
                  v-if="editMode"
                  v-model="editedUser.pais"
                  type="text"
                  class="info-input"
                  :placeholder="t('enterCountry')"
              />
              <p v-else class="info-value">{{ user.pais || '-' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 1200px;
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

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
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

.profile-content {
  display: grid;
  gap: 2rem;
}

.profile-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.user-basic-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.user-name {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.user-email {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
}

.user-type {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  width: fit-content;
}

.profile-actions {
  display: flex;
  gap: 1rem;
}

.btn-edit,
.btn-cancel,
.btn-save {
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-edit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-cancel {
  background: #f1f5f9;
  color: #64748b;
}

.btn-cancel:hover {
  background: #e2e8f0;
  color: #475569;
}

.btn-save {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
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

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #475569;
}

.info-label i {
  color: #94a3b8;
  font-size: 1rem;
}

.info-value {
  font-size: 1rem;
  color: #1a202c;
  padding: 0.875rem 1rem;
  background: #f8fafc;
  border-radius: 10px;
  margin: 0;
  min-height: 48px;
  display: flex;
  align-items: center;
}

.info-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  color: #1a202c;
  background: white;
  transition: all 0.3s ease;
}

.info-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

@media (max-width: 768px) {
  .profile-container {
    padding: 1.5rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .profile-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .profile-actions {
    width: 100%;
    flex-direction: column;
  }

  .btn-edit,
  .btn-cancel,
  .btn-save {
    width: 100%;
    justify-content: center;
  }

  .avatar-section {
    flex-direction: column;
    text-align: center;
    width: 100%;
  }

  .user-basic-info {
    align-items: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
