import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const appointmentService = {
    // Obtener todas las citas
    async getAllAppointments() {
        try {
            console.log('📅 Obteniendo todas las citas...');
            const response = await axios.get(`${API_URL}/appointments`);
            
            // JSON Server devuelve el array directo
            return response.data || [];
        } catch (error) {
            console.error('❌ Error obteniendo citas:', error);
            return [];
        }
    },

    // Obtener citas de un psicólogo específico (Usando filtros de JSON Server)
    async getPsychologistAppointments(psychologistId) {
        try {
            console.log(`👨‍⚕️ Filtrando citas para el psicólogo ID: ${psychologistId}...`);

            // En lugar de filtrar a mano, dejamos que el servidor lo haga:
            const response = await axios.get(`${API_URL}/appointments?psychologistId=${psychologistId}`);
            
            console.log(`✅ Citas encontradas: ${response.data.length}`);
            return response.data;
        } catch (error) {
            console.error(`❌ Error obteniendo citas del psicólogo:`, error);
            return [];
        }
    },

    // Crear una nueva cita
    async createAppointment(appointmentData) {
        try {
            console.log('➕ Creando nueva cita:', appointmentData);

            // Al hacer POST, JSON Server le asigna un ID automáticamente y devuelve el objeto creado
            const response = await axios.post(`${API_URL}/appointments`, {
                ...appointmentData,
                createdAt: new Date().toISOString(),
                status: appointmentData.status || 'confirmed'
            });

            console.log('✅ Cita creada exitosamente');
            return response.data;
        } catch (error) {
            console.error('❌ Error creando cita:', error);
            throw error;
        }
    },

    // Bonus: Obtener citas de un paciente específico
    async getPatientAppointments(patientId) {
        try {
            const response = await axios.get(`${API_URL}/appointments?patientId=${patientId}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error obteniendo citas del paciente:', error);
            return [];
        }
    }
};