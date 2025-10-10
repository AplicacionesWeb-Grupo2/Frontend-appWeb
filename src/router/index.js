import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SubscriptionsView from '../views/SubscriptionsView.vue';
import AgendaView from '../views/AgendaView.vue';
import TasksView from '../views/TasksView.vue';
import ContentView from '../views/ContentView.vue';
import PsychologistsView from '../views/PsychologistsView.vue';

const routes = [
    { path: '/', name: 'Home', component: HomeView },
    { path: '/suscripciones', name: 'Subscriptions', component: SubscriptionsView },
    { path: '/agenda', name: 'Agenda', component: AgendaView },
    { path: '/tareas', name: 'Tasks', component: TasksView },
    { path: '/contenido', name: 'Content', component: ContentView },
    { path: '/psicologos', name: 'Psychologists', component: PsychologistsView },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;