import { createApp } from 'vue';
import App from './App.vue';
import i18n from './i18n';
import './assets/styles/main.css';
import './assets/styles/global-improvements.css';
import router from './router';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

// IMPORTANTE: Agregar PrimeIcons
import 'primeicons/primeicons.css';

import { Button, InputText, Card, Toolbar, Image } from 'primevue';

createApp(App)
    .use(PrimeVue, {
        theme: {
            preset: Aura
        }
    })
    .use(router)
    .use(i18n)
    .component('pv-Image', Image)
    .component('pv-Button', Button)
    .component('pv-InputText', InputText)
    .component('pv-Card', Card)
    .component('pv-Toolbar', Toolbar)
    .mount('#app');
