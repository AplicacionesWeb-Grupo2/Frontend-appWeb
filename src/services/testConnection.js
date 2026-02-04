import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const testConnection = {
    async testBackend() {
        try {
            console.log('🔍 Probando conexión con JSON Server...');

            // Test 1: Intentar obtener los usuarios (en minúsculas)
            // JSON Server devolverá un array directo en response.data
            const responseUsers = await axios.get(`${API_URL}/users`);
            console.log('✅ Users endpoint:', responseUsers.data);

            // Test 2: Intentar obtener psicólogos (en minúsculas)
            const responsePsych = await axios.get(`${API_URL}/psychologists`);
            console.log('✅ Psychologists endpoint:', responsePsych.data);

            return {
                success: true,
                message: "Conexión exitosa con JSON Server",
                usersCount: responseUsers.data?.length || 0,
                psychologistsCount: responsePsych.data?.length || 0
            };

        } catch (error) {
            console.error('❌ Error conectando al backend:', error.message);

            if (error.response) {
                console.error('📡 Detalles del error:', {
                    status: error.response.status,
                    url: error.config.url,
                    info: "Asegúrate de que json-server esté corriendo en el puerto 3000"
                });
            }

            return {
                success: false,
                error: error.message,
                status: error.response?.status
            };
        }
    }
};