import { createRouter, createWebHistory } from 'vue-router';
import { authService } from '../services/authService';
import LoginView from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';
import SubscriptionsView from '../views/SubscriptionsView.vue';
import AgendaView from '../views/AgendaView.vue';
import TasksView from '../views/TasksView.vue';
import ContentView from '../views/ContentView.vue';
import PsychologistsView from '../views/PsychologistsView.vue';
import PsychologistsList from '../components/PsychologistsList.vue';

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: LoginView,
        meta: { requiresGuest: true }
    },
    {
        path: '/',
        name: 'Home',
        component: HomeView,
        meta: { requiresAuth: true }
    },
    {
        path: '/suscripciones',
        name: 'Subscriptions',
        component: SubscriptionsView,
        meta: { requiresAuth: true }
    },
    {
        path: '/agenda',
        name: 'Agenda',
        component: AgendaView,
        meta: { requiresAuth: true }
    },
    {
        path: '/tareas',
        name: 'Tasks',
        component: TasksView,
        meta: { requiresAuth: true }
    },
    {
        path: '/contenido',
        name: 'Content',
        component: ContentView,
        meta: { requiresAuth: true }
    },
    {
        path: '/psicologos',
        name: 'Psychologists',
        component: PsychologistsView,  // Esta es la vista de TUS CITAS
        meta: { requiresAuth: true }
    },
    {
        path: '/elegir-psicologo',
        name: 'PsychologistsList',
        component: PsychologistsList,  // Esta es la lista completa para elegir
        meta: { requiresAuth: true }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Guard de navegación global
router.beforeEach((to, from, next) => {
    const isAuthenticated = authService.isAuthenticated();

    if (to.meta.requiresAuth && !isAuthenticated) {
        // Si la ruta requiere autenticación y el usuario no está autenticado
        next('/login');
    } else if (to.meta.requiresGuest && isAuthenticated) {
        // Si la ruta es para invitados (login) y el usuario ya está autenticado
        next('/');
    } else {
        next();
    }
});

export default router;