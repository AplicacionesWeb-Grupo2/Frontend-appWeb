import axios from 'axios';

const API_URL = 'https://app-eiramind.azurewebsites.net/api';

export const psychologistService = {
    async getAllPsychologists() {
        try {
            console.log('🔍 Obteniendo psicólogos desde:', `${API_URL}/Psychologists`);

            const response = await axios.get(`${API_URL}/Psychologists`);
            console.log('📊 Respuesta completa del backend:', response.data);

            if (response.data && response.data.success && response.data.data) {
                const psychologists = response.data.data;
                console.log(`✅ Se encontraron ${psychologists.length} psicólogos`);

                // Transformar los datos
                const transformedPsychologists = psychologists.map(psych => {
                    return this.transformPsychologist(psych);
                });

                console.log('✨ Psicólogos transformados:', transformedPsychologists);
                return transformedPsychologists;
            }

            console.warn('⚠️ No hay datos o formato incorrecto');
            return [];

        } catch (error) {
            console.error('❌ Error obteniendo psicólogos:', error);
            return [];
        }
    },

    // Función para transformar un psicólogo individual
    transformPsychologist(psych) {
        console.log('🔄 Transformando psicólogo:', psych.id, psych.nombre);

        // Parsear certificaciones
        let certificaciones = [];
        if (psych.certificaciones) {
            if (typeof psych.certificaciones === 'string') {
                certificaciones = psych.certificaciones
                    .split(',')
                    .map(item => item.trim())
                    .filter(item => item.length > 0);
            } else if (Array.isArray(psych.certificaciones)) {
                certificaciones = psych.certificaciones;
            }
        }

        // Parsear idiomas
        let idiomas = [];
        if (psych.idiomas) {
            if (typeof psych.idiomas === 'string') {
                idiomas = psych.idiomas
                    .split(',')
                    .map(item => item.trim())
                    .filter(item => item.length > 0);
            } else if (Array.isArray(psych.idiomas)) {
                idiomas = psych.idiomas;
            }
        }

        // Parsear metodologias
        let metodologias = [];
        if (psych.metodologias) {
            if (typeof psych.metodologias === 'string') {
                metodologias = psych.metodologias
                    .split(',')
                    .map(item => item.trim())
                    .filter(item => item.length > 0);
            } else if (Array.isArray(psych.metodologias)) {
                metodologias = psych.metodologias;
            }
        }

        // Parsear horarios - ¡ESTO ES CLAVE!
        let proximosHorarios = [];
        if (psych.horarios) {
            try {
                // Limpiar el string JSON
                let cleanHorarios = psych.horarios
                    .replace(/\r\n/g, '')        // Eliminar saltos de línea
                    .replace(/\n/g, '')          // Eliminar saltos de línea Unix
                    .replace(/\t/g, '')          // Eliminar tabs
                    .replace(/\\"/g, '"')        // Cambiar comillas escapadas
                    .replace(/  +/g, ' ')        // Eliminar múltiples espacios
                    .trim();

                // Verificar si es un JSON válido
                if (cleanHorarios.startsWith('[') && cleanHorarios.endsWith(']')) {
                    proximosHorarios = JSON.parse(cleanHorarios);
                    console.log('✅ Horarios parseados correctamente');
                } else {
                    console.warn('⚠️ Horarios no es un JSON válido:', cleanHorarios.substring(0, 100));
                    proximosHorarios = this.getDefaultHorarios();
                }
            } catch (e) {
                console.error('❌ Error parseando horarios:', e.message);
                console.log('📄 Horarios raw:', psych.horarios);
                proximosHorarios = this.getDefaultHorarios();
            }
        } else {
            // Si no hay horarios, usar valores por defecto
            proximosHorarios = this.getDefaultHorarios();
        }

        // Crear el objeto transformado
        const transformedPsych = {
            id: psych.id.toString(),
            email: psych.email || '',
            nombre: psych.nombre || 'Psicólogo',
            tipo: psych.tipo || 'psicologo',
            especialidad: psych.especialidad || 'Psicología Clínica',
            calificacion: psych.calificacion || 5,
            imagen: psych.imagen || `https://i.pravatar.cc/150?img=${psych.id || 1}`,
            descripcion: psych.descripcion || 'Especialista en terapia psicológica',
            biografia: psych.biografia || '',
            educacion: psych.educacion || '',
            certificaciones: certificaciones,
            idiomas: idiomas,
            metodologias: metodologias,
            anosExperiencia: psych.anosExperiencia || 5,
            atendeEdades: psych.atendeEdades || 'Adultos (18-65 años)',
            proximosHorarios: proximosHorarios
        };

        console.log('✨ Psicólogo transformado:', {
            nombre: transformedPsych.nombre,
            horariosCount: transformedPsych.proximosHorarios?.length || 0
        });

        return transformedPsych;
    },

    // Horarios por defecto
    getDefaultHorarios() {
        return [
            {
                fecha: "2024-10-22",
                dia: "Martes 22 octubre",
                horas: ["10:00", "14:00", "16:00"]
            },
            {
                fecha: "2024-10-24",
                dia: "Jueves 24 octubre",
                horas: ["09:00", "13:00", "15:00"]
            }
        ];
    },

    async getPsychologistById(id) {
        try {
            console.log(`🔍 Obteniendo psicólogo ID: ${id}`);

            const response = await axios.get(`${API_URL}/Psychologists/${id}`);
            console.log('📊 Respuesta del psicólogo:', response.data);

            if (response.data && response.data.success && response.data.data) {
                return this.transformPsychologist(response.data.data);
            }

            return null;

        } catch (error) {
            console.error(`❌ Error obteniendo psicólogo ${id}:`, error);
            throw error;
        }
    }
};