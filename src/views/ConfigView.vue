<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService';
import axios from 'axios';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { locale, t } = useI18n();

// Usuario
const user = reactive({ id: null, nombre: '', email: '' });
const password = ref('');

// Notificaciones
const notifications = reactive({ email: true, push: false });

// Preferencias
const preferences = reactive({ language: 'es' });

onMounted(() => {
  const currentUser = authService.getCurrentUser();
  if (!currentUser) {
    alert(t('sesionIniciada'));
    router.push('/login');
    return;
  }
  user.id = currentUser.id;
  user.nombre = currentUser.nombre;
  user.email = currentUser.email;
});

// Cambiar idioma
const changeLanguage = () => {
  locale.value = preferences.language;
};

// Guardar perfil
const updateProfile = async () => {
  try {
    const updatedUser = { nombre: user.nombre, email: user.email };
    if (password.value) updatedUser.password = password.value;

    await axios.put(`http://localhost:3000/users/${user.id}`, updatedUser);
    alert(t('perfilActualizado'));
    password.value = '';
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    alert(t('errorPerfil'));
  }
};

// Guardar notificaciones
const updateNotifications = () => {
  alert(`Preferencias guardadas: Email ${notifications.email}, Push ${notifications.push}`);
};

// Logout
const logout = () => {
  authService.logout();
  router.push('/login');
};
</script>

<template>
  <h1>⚙️ {{ t('settings.title') }}</h1>
  <p class="subtitle">{{ t('settings.subtitle') }}</p>

  <section class="settings-section">
    <h2>{{ t('settings.profile.title') }}</h2>
    <div class="field">
      <label>{{ t('settings.profile.name') }}</label>
      <input v-model="user.nombre" type="text" :placeholder="t('settings.profile.name')" />
    </div>
    <div class="field">
      <label>{{ t('settings.profile.email') }}</label>
      <input v-model="user.email" type="email" :placeholder="t('settings.profile.email')" />
    </div>
    <div class="field">
      <label>{{ t('settings.profile.password') }}</label>
      <input v-model="password" type="password" :placeholder="t('settings.profile.password')" />
    </div>
    <button @click="updateProfile" class="btn-primary">{{ t('settings.profile.save') }}</button>
  </section>

  <section class="settings-section">
    <h2>{{ t('settings.notifications.title') }}</h2>
    <label class="toggle">
      <input type="checkbox" v-model="notifications.email" />
      <span>{{ t('settings.notifications.email') }}</span>
    </label>
    <label class="toggle">
      <input type="checkbox" v-model="notifications.push" />
      <span>{{ t('settings.notifications.push') }}</span>
    </label>
    <button @click="updateNotifications" class="btn-secondary">{{ t('settings.notifications.save') }}</button>
  </section>

  <section class="settings-section">
    <h2>{{ t('settings.preferences.title') }}</h2>
    <label for="language">{{ t('settings.preferences.language') }}:</label>
    <select v-model="preferences.language" id="language" @change="changeLanguage">
      <option value="es">Español</option>
      <option value="en">English</option>
    </select>
  </section>

  <section class="settings-section logout-section">
    <button @click="logout" class="btn-danger">{{ t('settings.actions.logout') }}</button>
  </section>

</template>

<style scoped>
.settings-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
}

h1 {
  color: #003d91;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  margin-bottom: 2rem;
}

.settings-section {
  background: white;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.settings-section h2 {
  color: #0047ab;
  margin-bottom: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.field label {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.field input, .field select {
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
}

button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #003d91;
  color: white;
}

.btn-primary:hover {
  background-color: #0047ab;
}

.btn-secondary {
  background-color: white;
  color: #0047ab;
  border: 2px solid #0047ab;
}

.btn-secondary:hover {
  background-color: #0047ab;
  color: white;
}

.btn-danger {
  background-color: white;
  color: #dc3545;
  border: 2px solid #dc3545;
}

.btn-danger:hover {
  background-color: #dc3545;
  color: white;
}

.logout-section {
  display: flex;
  justify-content: center;
}
</style>
