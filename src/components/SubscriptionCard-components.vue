<template>
  <div class="bg-white rounded-2xl shadow-md p-6 text-center border hover:shadow-lg transition">
    <h2 class="text-2xl font-bold mb-2 text-indigo-600">{{ plan.name }}</h2>
    <p class="text-gray-700 mb-4 font-semibold">{{ plan.price }}</p>
    <ul class="text-gray-600 mb-4 space-y-2">
      <li v-for="(feature, i) in plan.features" :key="i">
        ✅ {{ feature }}
      </li>
    </ul>
    <button
        class="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition"
        @click="$emit('subscribe', plan)"
    >
      {{ t('subscriptions.card.choose') }}
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps({
  plan: {
    type: Object,
    required: true
  }
});
</script>

