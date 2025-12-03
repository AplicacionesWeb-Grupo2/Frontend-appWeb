import axios from 'axios';

const API_URL = 'http://localhost:5293/api';

export const appointmentService = {
    async getAllAppointments() {
        try {
            console.log('📅 Obteniendo todas las citas...');

            const response = await axios.get(`${API_URL}/Appointments`);
            console.log('📊 Respuesta citas:', response.data);

            if (response.data && response.data.success) {
                return response.data.data || [];
            }

            console.warn('⚠️ Respuesta sin formato esperado');
            return [];

        } catch (error) {
            console.error('❌ Error obteniendo citas:', error);
            throw error;
        }
    },

    async getPsychologistAppointments(psychologistId) {
        try {
            console.log(`👨‍⚕️ Obteniendo citas del psicólogo ${psychologistId}...`);

            const allAppointments = await this.getAllAppointments();

            // Filtrar citas del psicólogo específico
            const psychologistAppointments = allAppointments.filter(
                app => app.psychologistId === psychologistId ||
                    app.psychologistId?.toString() === psychologistId.toString()
            );

            console.log(`✅ Citas encontradas: ${psychologistAppointments.length}`);
            return psychologistAppointments;

        } catch (error) {
            console.error(`❌ Error obteniendo citas del psicólogo:`, error);
            throw error;
        }
    },

    async createAppointment(appointmentData) {
        try {
            console.log('➕ Creando nueva cita:', appointmentData);

            const response = await axios.post(`${API_URL}/Appointments`, appointmentData);
            console.log('✅ Cita creada:', response.data);

            return response.data;
        } catch (error) {
            console.error('❌ Error creando cita:', error);
            throw error;
        }
    }
};