<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { registerUser } from '../services/authService';

const router = useRouter();

const nombre = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const success = ref('');

const handleRegister = async () => {
  error.value = '';
  success.value = '';

  // Validaciones básicas
  if (!nombre.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = 'Por favor, completa todos los campos.';
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden.';
    return;
  }

  try {
    await registerUser({
      name: nombre.value,
      email: email.value,
      password: password.value,
    });

    success.value = 'Usuario registrado exitosamente. Redirigiendo al login...';
    setTimeout(() => router.push('/login'), 2000);
  } catch (err) {
    error.value = err.message || 'Error al registrar usuario.';
  }
};
</script>

<template>
  <div class="register-container">
    <h2>Crear una cuenta</h2>

    <div class="form-group">
      <label>Nombre completo</label>
      <input type="text" v-model="nombre" placeholder="Tu nombre" />
    </div>

    <div class="form-group">
      <label>Correo electrónico</label>
      <input type="email" v-model="email" placeholder="ejemplo@correo.com" />
    </div>

    <div class="form-group">
      <label>Contraseña</label>
      <input type="password" v-model="password" placeholder="••••••••" />
    </div>

    <div class="form-group">
      <label>Confirmar contraseña</label>
      <input type="password" v-model="confirmPassword" placeholder="••••••••" />
    </div>

    <button @click="handleRegister">Registrarse</button>

    <p v-if="error" class="error-msg">{{ error }}</p>
    <p v-if="success" class="success-msg">{{ success }}</p>

    <router-link to="/login" class="login-link">¿Ya tienes cuenta? Inicia sesión</router-link>
  </div>
</template>

<style scoped>
.register-container {
  width: 400px;
  margin: 6rem auto;
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  text-align: center;
}

h2 {
  color: #003d91;
  margin-bottom: 1.5rem;
}

.form-group {
  text-align: left;
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.3rem;
  color: #003d91;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.8rem;
  background: #003d91;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background 0.2s;
}

button:hover {
  background: #0055cc;
}

.error-msg {
  color: #e63946;
  margin-top: 1rem;
}

.success-msg {
  color: #2a9d8f;
  margin-top: 1rem;
}

.login-link {
  display: block;
  margin-top: 1.5rem;
  color: #007bff;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}
</style>
