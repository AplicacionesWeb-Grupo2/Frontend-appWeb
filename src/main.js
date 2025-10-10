import { createApp } from 'vue'
import App from './App.vue'

import './assets/styles/main.css';
import router from './router';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import {Button, InputText, Card, Toolbar, Image } from 'primevue'

createApp(App)
    .use(PrimeVue,{
        theme: {
            preset: Aura
        }
    })
    .use(router)
    .component('pv-Image', Image)
    .component('pv-Button', Button)
    .component('pv-InputText', InputText)
    .component('pv-Card', Card)
    .component('pv-Toolbar', Toolbar)
    .mount('#app')
