<template>
  <div class="connection-test">
    <button @click="testBackendConnection" :disabled="testing">
      {{ testing ? 'Probando...' : '🔍 Probar Conexión Backend' }}
    </button>

    <div v-if="result" class="result">
      <h3>✅ Backend Conectado</h3>
      <pre>{{ result }}</pre>
    </div>

    <div v-if="error" class="error">
      <h3>❌ Error de Conexión</h3>
      <pre>{{ error }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { testConnection } from '@/services/testConnection';

const testing = ref(false);
const result = ref(null);
const error = ref(null);

const testBackendConnection = async () => {
  testing.value = true;
  result.value = null;
  error.value = null;

  const response = await testConnection.testBackend();

  if (response.success) {
    result.value = response;
  } else {
    error.value = response;
  }

  testing.value = false;
};
</script>

<style scoped>
.connection-test {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin: 20px;
}

button {
  padding: 10px 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result, .error {
  margin-top: 15px;
  padding: 15px;
  border-radius: 5px;
}

.result {
  background: #d4edda;
  border: 1px solid #c3e6cb;
}

.error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>