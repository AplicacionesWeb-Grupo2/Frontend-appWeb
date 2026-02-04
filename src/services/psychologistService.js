import { axiosInstance } from './authService';

const API_URL = 'http://localhost:3000';

export const psychologistService = {
    async getAllPsychologists() {
        try {
            // 1. JSON Server devuelve el array directamente en response.data
            const response = await axiosInstance.get('/psychologists');
            const psychologists = response.data;

            console.log(`✅ Se encontraron ${psychologists.length} psicólogos`);

            // 2. Transformar los datos (ahora mucho más simple)
            return psychologists.map(psych => this.transformPsychologist(psych));

        } catch (error) {
            console.error('❌ Error obteniendo psicólogos:', error);
            return [];
        }
    },

    transformPsychologist(psych) {
        // En tu bd.json, estos campos YA SON ARRAYS. 
        // Solo verificamos que existan, si no, ponemos un array vacío.
        return {
            ...psych,
            id: psych.id.toString(),
            nombre: psych.nombre || 'Psicólogo sin nombre',
            // Usamos el nombre exacto de la llave en tu JSON: 'proximosHorarios'
            proximosHorarios: psych.proximosHorarios || this.getDefaultHorarios(),
            certificaciones: Array.isArray(psych.certificaciones) ? psych.certificaciones : [],
            idiomas: Array.isArray(psych.idiomas) ? psych.idiomas : [],
            metodologias: Array.isArray(psych.metodologias) ? psych.metodologias : [],
            imagen: psych.imagen || `https://i.pravatar.cc/150?img=${psych.id}`
        };
    },

    async getPsychologistById(id) {
        try {
            // Nota: JSON Server usa minúsculas en los endpoints
            const response = await axiosInstance.get(`/psychologists/${id}`);
            
            if (response.data) {
                return this.transformPsychologist(response.data);
            }
            return null;
        } catch (error) {
            console.error(`❌ Error obteniendo psicólogo ${id}:`, error);
            return null;
        }
    },

    getDefaultHorarios() {
        return [
            {
                fecha: "2024-10-22",
                dia: "Martes 22 octubre",
                horas: ["10:00", "14:00"]
            }
        ];
    }
};