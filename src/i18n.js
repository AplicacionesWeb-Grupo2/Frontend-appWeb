// src/i18n.js
import { createI18n } from 'vue-i18n';

import en from './locales/en.json';
import es from './locales/es.json';

export const i18n = createI18n({
    legacy: false, // para usar Composition API
    locale: 'es',  // idioma por defecto
    fallbackLocale: 'en',
    messages: {
        en,
        es
    }
});
