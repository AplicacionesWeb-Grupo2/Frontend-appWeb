<template>
  <div>
    <!-- BOTÓN FLOTANTE -->
    <button
        v-if="!open"
        @click="open = true"
        class="chatbot-button"
    >
      💬
    </button>

    <!-- VENTANA DEL CHAT -->
    <div v-else class="chatbot-window">
      <!-- ENCABEZADO -->
      <div class="chatbot-header">
        <h2 class="title">EiraMind Bot 🤖</h2>
        <button @click="open = false" class="close-btn">✖</button>
      </div>

      <!-- MENSAJES -->
      <div class="chatbot-messages">
        <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['message', msg.sender]"
        >
          <div class="message-text">{{ msg.text }}</div>
        </div>
      </div>

      <!-- INPUT -->
      <div class="chatbot-input">
        <input
            v-model="input"
            type="text"
            placeholder="Escribe algo..."
            @keyup.enter="handleSend"
        />
        <button @click="handleSend" class="send-btn">Enviar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const open = ref(false);
const input = ref("");
const messages = ref([
  { sender: "bot", text: "¡Hola! 👋 ¿En qué puedo ayudarte hoy?" },
]);

const handleSend = () => {
  if (!input.value.trim()) return;

  const userMessage = { sender: "user", text: input.value };
  messages.value.push(userMessage);
  input.value = "";

  setTimeout(() => {
    messages.value.push({
      sender: "bot",
      text: "Gracias por tu mensaje 😊. Pronto te responderé.",
    });
  }, 700);
};
</script>

<style scoped>
.chatbot-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #003d91;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 14px;
  cursor: pointer;
  font-size: 22px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.chatbot-button:hover {
  background-color: #0050c7;
}

.chatbot-window {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 320px;
  height: 420px;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chatbot-header {
  background-color: #003d91;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
}

.chatbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message.user {
  align-self: flex-end;
}

.message.bot {
  align-self: flex-start;
}

.message-text {
  background: #f1f1f1;
  padding: 8px 12px;
  border-radius: 10px;
  max-width: 70%;
  word-wrap: break-word;
}

.message.user .message-text {
  background: #003d91;
  color: white;
}

.chatbot-input {
  border-top: 1px solid #ddd;
  display: flex;
  padding: 8px;
  gap: 5px;
}

.chatbot-input input {
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 6px 10px;
  outline: none;
}

.chatbot-input .send-btn {
  background-color: #003d91;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
}

.chatbot-input .send-btn:hover {
  background-color: #0050c7;
}
</style>
