<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const newTask = ref('');
const tasks = ref([]);

const addTask = () => {
  if (!newTask.value.trim()) return;
  tasks.value.push({
    id: Date.now(),
    text: newTask.value,
    completed: false
  });
  newTask.value = '';
};

const toggleTask = (task) => {
  task.completed = !task.completed;
};

const deleteTask = (taskId) => {
  tasks.value = tasks.value.filter(t => t.id !== taskId);
};
</script>

<template>
  <div class="tasks-container">
    <h1> {{ t('tasks.title') }}</h1>
    <div class="add-task">
      <input
          v-model="newTask"
          :placeholder="t('tasks.placeholder')"
          @keyup.enter="addTask"
      />
      <button @click="addTask">{{ t('tasks.addButton') }}</button>
    </div>
    <ul class="tasks-list">
      <li
          v-for="task in tasks"
          :key="task.id"
          :class="{ completed: task.completed }"
      >
        <span @click="toggleTask(task)">{{ task.text }}</span>
        <button class="delete-btn" @click="deleteTask(task.id)">❌</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.tasks-container {
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
}
.add-task {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.add-task input {
  flex: 1;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.add-task button {
  padding: 0.75rem 1rem;
  background-color: #003d91;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.tasks-list {
  list-style: none;
  padding: 0;
}
.tasks-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e0e0e0;
}
.tasks-list li.completed span {
  text-decoration: line-through;
  color: #999;
}
.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
}
</style>
