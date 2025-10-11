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

const routes = [
    { path: '/login', name: 'Login', component: LoginView, meta: { requiresGuest: true } },
    { path: '/', name: 'Home', component: HomeView, meta: { requiresAuth: true } },
    { path: '/suscripciones', component: SubscriptionsView, meta: { requiresAuth: true } },
    { path: '/agenda', component: AgendaView, meta: { requiresAuth: true } },
    { path: '/tareas', component: TasksView, meta: { requiresAuth: true } },
    { path: '/contenido', component: ContentView, meta: { requiresAuth: true } },
    { path: '/psicologos', component: PsychologistsView, meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView }
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
