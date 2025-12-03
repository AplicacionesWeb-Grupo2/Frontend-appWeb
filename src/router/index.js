import { createRouter, createWebHistory } from 'vue-router';
import { authService } from '../services/authService';

import LoginView from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';
import SubscriptionsView from '../views/SubscriptionsView.vue';
import AgendaView from '../views/AgendaView.vue';
import RecordingsView from '../views/RecordingsView.vue';
import PsychologistsList from '../components/PsychologistsList.vue';
import PsychologistProfileView from '../views/PsychologistProfileView.vue';
import ProfileView from '../views/ProfileView.vue';
import PsychologistDashboard from '../views/PsychologistDashboard.vue';

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
        path: '/grabaciones',
        name: 'Recordings',
        component: RecordingsView,
        meta: { requiresAuth: true }
    },
    {
        path: '/psicologos',
        name: 'Psychologists',
        component: PsychologistsList,
        meta: { requiresAuth: true }
    },
    {
        path: '/psicologo/:id',
        name: 'PsychologistProfile',
        component: PsychologistProfileView,
        meta: { requiresAuth: true }
    },
    {
        path: '/perfil',
        name: 'Profile',
        component: ProfileView,
        meta: { requiresAuth: true }
    },
    // Rutas para psicólogos
    {
        path: '/psychologists',
        name: 'Psychologists',
        component: () => import('@/views/PsychologistsView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/psychologist/:id',
        name: 'PsychologistProfile',
        component: () => import('@/views/PsychologistProfileView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/psychologist-dashboard',
        name: 'PsychologistDashboard',
        component: () => import('@/views/PsychologistDashboard.vue'),
        meta: { requiresAuth: true, requiresPsychologist: true }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = authService.isAuthenticated();
    const userType = authService.getUserType();

    // Verificar si requiere autenticación
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
        return;
    }

    // Verificar si requiere invitado (no autenticado)
    if (to.meta.requiresGuest && isAuthenticated) {
        // Redirigir según el tipo de usuario
        if (userType === 'psychologist') {
            next('/psychologist');
        } else {
            next('/');
        }
        return;
    }

    // Verificar si requiere ser psicólogo
    if (to.meta.requiresPsychologist && userType !== 'psychologist') {
        next('/');
        return;
    }

    // Verificar si es psicólogo y trata de acceder a rutas de paciente
    if (isAuthenticated && userType === 'psychologist' &&
        !to.path.startsWith('/psychologist') &&
        to.path !== '/login') {
        next('/psychologist');
        return;
    }

    next();
});

export default router;
