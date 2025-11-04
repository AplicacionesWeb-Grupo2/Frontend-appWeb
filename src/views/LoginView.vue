<template>
  <div class="login-container">
    <div class="login-card">
      <div class="welcome-section">
        <div class="logo-section">
          <img src="../assets/icons/logo_EiraMind.png" alt="EiraMind Logo" class="logo" />
          <h1>EiraMind</h1>
        </div>

        <div class="welcome-illustration">
          <img src="../assets/icons/iconlogin.jpg" alt="EiraMind Characters" class="characters-img" />
        </div>

        <div class="no-account">
          <p>{{ t('noAccount') }}</p>
          <a href="#" class="register-link">{{ t('registerNow') }}</a>
        </div>
      </div>

      <div class="login-section">
        <h2>{{ t('loginWith') }}</h2>

        <div class="social-buttons">
          <button class="social-btn facebook-btn" disabled>
            <i class="pi pi-facebook"></i>
            <span>{{ t('facebook') }}</span>
            <i class="pi pi-chevron-right"></i>
          </button>

          <button class="social-btn google-btn" disabled>
            <i class="pi pi-google"></i>
            <span>{{ t('google') }}</span>
            <i class="pi pi-chevron-right"></i>
          </button>
        </div>

        <div class="divider">
          <span>{{ t('or') }}</span>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">{{ t('email') }}</label>
            <input
                id="email"
                v-model="email"
                type="email"
                :placeholder="t('emailPlaceholder')"
                required
            />
          </div>

          <div class="form-group">
            <label for="password">{{ t('password') }}</label>
            <div class="password-input">
              <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="t('passwordPlaceholder')"
                  required
              />
              <button
                  type="button"
                  class="toggle-password"
                  @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            </div>
          </div>

          <div class="forgot-password">
            <a href="#">{{ t('forgotPassword') }}</a>
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? t('loggingIn') : t('login') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { authService } from '../services/authService';

const { t } = useI18n();
const router = useRouter();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const errorMessage = ref('');
const loading = ref(false);

const handleLogin = async () => {
  errorMessage.value = '';
  loading.value = true;

  try {
    const success = await authService.login(email.value, password.value);

    if (success) {
      router.push('/');
    } else {
      errorMessage.value = t('incorrectCredentials');
    }
  } catch (error) {
    errorMessage.value = t('loginError');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0047ab 0%, #003d99 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  overflow: hidden;
}

/* Welcome Section */
.welcome-section {
  background: white;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.logo {
  width: 50px;
  height: 50px;
}

.logo-section h1 {
  color: #0047ab;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.welcome-illustration {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.characters-img {
  max-width: 250px;
  width: 100%;
  height: auto;
}

.no-account {
  text-align: center;
}

.no-account p {
  margin-bottom: 0.5rem;
  color: #333;
}

.register-link {
  color: #0047ab;
  text-decoration: none;
  font-weight: 600;
}

.register-link:hover {
  text-decoration: underline;
}

/* Login Section */
.login-section {
  padding: 3rem;
  background: #f9f9f9;
}

.login-section h2 {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.social-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background: white;
  cursor: not-allowed;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.social-btn i:first-child {
  font-size: 1.5rem;
}

.social-btn span {
  flex: 1;
  text-align: left;
  margin-left: 1rem;
  font-weight: 500;
  color: #333;
}

.facebook-btn i:first-child {
  color: #1877f2;
}

.google-btn i:first-child {
  color: #db4437;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #666;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e0e0e0;
}

.divider span {
  padding: 0 1rem;
  font-weight: 500;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.form-group input {
  padding: 0.875rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #0047ab;
}

.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input input {
  flex: 1;
  padding-right: 3rem;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 1.2rem;
  padding: 0.5rem;
}

.toggle-password:hover {
  color: #333;
}

.forgot-password {
  text-align: left;
  margin-top: -0.5rem;
}

.forgot-password a {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 8px;
  text-align: center;
  font-size: 0.9rem;
}

.login-btn {
  background: linear-gradient(135deg, #0047ab 0%, #003d99 100%);
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 71, 171, 0.3);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .login-card {
    grid-template-columns: 1fr;
  }

  .welcome-section {
    padding: 2rem;
  }

  .login-section {
    padding: 2rem;
  }
}
</style>