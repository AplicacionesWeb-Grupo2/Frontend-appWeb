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
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = authService.isAuthenticated();

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else if (to.meta.requiresGuest && isAuthenticated) {
        next('/');
    } else {
        next();
    }
});

export default router;
