import { createApp } from 'vue'
import App from './App.vue'

import './assets/styles/main.css';
import router from './router';

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

// Componentes PrimeVue
import {
    Button,
    InputText,
    Card,
    Toolbar,
    Image,
    Dialog,
    Calendar,
    Toast
} from 'primevue';

import ToastService from 'primevue/toastservice';

const app = createApp(App);

app.use(PrimeVue, { theme: { preset: Aura } });
app.use(router);
app.use(ToastService);

app
    .component('pv-Image', Image)
    .component('pv-Button', Button)
    .component('pv-InputText', InputText)
    .component('pv-Card', Card)
    .component('pv-Toolbar', Toolbar)
    .component('pv-Dialog', Dialog)
    .component('pv-Calendar', Calendar)
    .component('pv-Toast', Toast);

app.mount('#app');
