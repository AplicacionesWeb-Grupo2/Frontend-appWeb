<script setup>
import { ref, onMounted } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';

const { t } = useI18n(); // Función de traducción
const toast = useToast();

// Variables reactivas
const events = ref([]);
const showDialog = ref(false);
const showDeleteDialog = ref(false);
const selectedEvent = ref(null);
const newEvent = ref({
  title: '',
  start: null
});
const loading = ref(false);

// Configuración del calendario
const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: 'es',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: ''
  },
  eventColor: '#003d91',
  eventTextColor: 'white',
  eventDidMount(info) {
    info.el.style.cursor = 'pointer';
  },
  dateClick(info) {
    newEvent.value.start = new Date(info.dateStr);
    newEvent.value.title = '';
    showDialog.value = true;
  },
  eventClick(info) {
    selectedEvent.value = info.event;
    showDeleteDialog.value = true;
  },
});

// Fetch de citas
const fetchEvents = async () => {
  try {
    const res = await fetch('http://localhost:3000/appointments');
    const data = await res.json();
    events.value = data;
    calendarOptions.value.events = data;
  } catch (error) {
    console.error('Error al cargar las citas:', error);
  }
};

// Guardar cita
const saveAppointment = async () => {
  if (!newEvent.value.title.trim()) {
    toast.add({
      severity: 'warn',
      summary: t('agenda.toast.requiredField'),
      detail: t('agenda.toast.enterTitle'),
      life: 3000
    });
    return;
  }
  if (!newEvent.value.start) {
    toast.add({
      severity: 'warn',
      summary: t('agenda.toast.requiredDate'),
      detail: t('agenda.toast.selectDate'),
      life: 3000
    });
    return;
  }

  loading.value = true;

  const appointment = {
    title: newEvent.value.title,
    start: newEvent.value.start.toISOString()
  };

  try {
    await fetch('http://localhost:3000/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointment)
    });

    toast.add({
      severity: 'success',
      summary: t('agenda.toast.saved'),
      detail: t('agenda.toast.savedDetail'),
      life: 2500
    });

    showDialog.value = false;
    newEvent.value = { title: '', start: null };
    await fetchEvents();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('agenda.toast.error'),
      detail: t('agenda.toast.errorDetail'),
      life: 2500
    });
    console.error('Error al guardar la cita:', error);
  } finally {
    loading.value = false;
  }
};

// Eliminar cita
const deleteAppointment = async () => {
  if (!selectedEvent.value) return;

  try {
    await fetch(`http://localhost:3000/appointments/${selectedEvent.value.id}`, {
      method: 'DELETE'
    });

    toast.add({
      severity: 'info',
      summary: t('agenda.toast.deleted'),
      detail: t('agenda.toast.deletedDetail', { title: selectedEvent.value.title }),
      life: 2500
    });

    showDeleteDialog.value = false;
    selectedEvent.value = null;
    await fetchEvents();
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: t('agenda.toast.error'),
      detail: t('agenda.toast.errorDelete'),
      life: 2500
    });
    console.error('Error al eliminar la cita:', error);
  }
};

// Cargar citas al iniciar
onMounted(() => {
  fetchEvents();
});
</script>

<template>
  <div class="agenda-container">
    <pv-Toast />

    <h1>{{ t('agenda.title') }}</h1>
    <p class="subtitle">{{ t('agenda.subtitle') }}</p>

    <div class="calendar">
      <FullCalendar :options="calendarOptions" />
    </div>

    <!-- Modal nueva cita -->
    <pv-Dialog v-model:visible="showDialog" :header="t('agenda.newAppointment')" modal class="dialog-custom">
      <div class="form">
        <div class="field">
          <label for="title">{{ t('agenda.fields.title') }}</label>
          <pv-InputText
              id="title"
              v-model="newEvent.title"
              :placeholder="t('agenda.fields.titlePlaceholder')"
          />
        </div>

        <div class="field">
          <label for="date">{{ t('agenda.fields.date') }}</label>
          <pv-Calendar
              id="date"
              v-model="newEvent.start"
              showTime
              hourFormat="24"
              dateFormat="yy-mm-dd"
              :placeholder="t('agenda.fields.datePlaceholder')"
          />
        </div>

        <div class="actions">
          <pv-Button
              :label="t('agenda.actions.cancel')"
              severity="secondary"
              @click="showDialog = false"
          />
          <pv-Button
              :label="t('agenda.actions.save')"
              :loading="loading"
              @click="saveAppointment"
              class="save-btn"
          />
        </div>
      </div>
    </pv-Dialog>

    <!-- Modal eliminar cita -->
    <pv-Dialog
        v-model:visible="showDeleteDialog"
        :header="t('agenda.deleteAppointment')"
        modal
        class="dialog-custom"
    >
      <p>{{ t('agenda.deleteConfirm', { title: selectedEvent?.title }) }}</p>
      <div class="actions">
        <pv-Button
            :label="t('agenda.actions.cancel')"
            severity="secondary"
            @click="showDeleteDialog = false"
        />
        <pv-Button
            :label="t('agenda.actions.delete')"
            severity="danger"
            @click="deleteAppointment"
        />
      </div>
    </pv-Dialog>
  </div>
</template>

<style scoped>
.agenda-container {
  padding: 2rem;
  text-align: center;
}

.subtitle {
  color: #666;
  margin-bottom: 1rem;
}

.calendar {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Modal */
.dialog-custom {
  width: 400px;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  text-align: left;
}

label {
  font-weight: 500;
  margin-bottom: 0.3rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.save-btn {
  background-color: #003d91;
  border: none;
}

/* ==== ESTILO DEL CALENDARIO ==== */
.fc {
  --fc-border-color: #e0e0e0;
  --fc-button-bg-color: #003d91;
  --fc-button-text-color: #fff;
  --fc-button-hover-bg-color: #0050c7;
  --fc-today-bg-color: #e6f0ff;
}

/* Cursor tipo mano al pasar por citas */
.fc-event {
  cursor: pointer !important;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

/* Efecto hover: se agranda un poco */
.fc-event:hover {
  transform: scale(1.02);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>
