// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { authService } from '../services/authService';

// Lazy loading para mejor rendimiento
const LoginView = () => import('../views/LoginView.vue');
const HomeView = () => import('../views/HomeView.vue');
const SubscriptionsView = () => import('../views/SubscriptionsView.vue');
const AgendaView = () => import('../views/AgendaView.vue');
const TasksView = () => import('../views/TasksView.vue');
const ContentView = () => import('../views/ContentView.vue');
const PsychologistsView = () => import('../views/PsychologistsView.vue');
const NotFoundView = () => import('../views/NotFoundView.vue');
import PsychologistsList from '../components/PsychologistsList.vue';
import ConfiguracionView from '../views/ConfigView.vue';

const routes = [
    { path: '/login', name: 'Login', component: LoginView, meta: { requiresGuest: true } },
    { path: '/register', name: 'Register', component: () => import('../views/RegisterView.vue') },
    { path: '/', name: 'Home', component: HomeView, meta: { requiresAuth: true } },
    { path: '/suscripciones', name: 'Suscripciones', component: SubscriptionsView, meta: { requiresAuth: true } },
    { path: '/agenda', component: AgendaView, meta: { requiresAuth: true } },
    { path: '/tareas', component: TasksView, meta: { requiresAuth: true } },
    { path: '/contenido', component: ContentView, meta: { requiresAuth: true } },
    { path: '/psicologos', name: 'Psychologists', component: PsychologistsView, meta: { requiresAuth: true } },
    { path: '/elegir-psicologo', name: 'PsychologistsList', component: PsychologistsList, meta: { requiresAuth: true } },
    { path: '/configuracion', name: 'Configuracion', component: ConfiguracionView, meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const isAuth = authService.isAuthenticated();

    if (to.meta.requiresAuth && !isAuth) next('/login');
    else if (to.meta.requiresGuest && isAuth) next('/');
    else next();
});

export default router;
