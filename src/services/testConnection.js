import axios from 'axios';

const API_URL = 'http://localhost:5293/api';

export const testConnection = {
    async testBackend() {
        try {
            console.log('🔍 Probando conexión con backend...');

            // Test 1: Endpoint básico
            const response1 = await axios.get(`${API_URL}/test`);
            console.log('✅ Test endpoint:', response1.data);

            // Test 2: Users endpoint
            const response2 = await axios.get(`${API_URL}/Users`);
            console.log('✅ Users endpoint:', response2.data);

            // Test 3: Psychologists endpoint
            const response3 = await axios.get(`${API_URL}/Psychologists`);
            console.log('✅ Psychologists endpoint:', response3.data);

            return {
                success: true,
                backend: response1.data,
                usersCount: response2.data?.data?.length || 0,
                psychologistsCount: response3.data?.data?.length || 0
            };

        } catch (error) {
            console.error('❌ Error conectando al backend:', error.message);

            if (error.response) {
                console.error('📡 Detalles:', {
                    status: error.response.status,
                    data: error.response.data,
                    url: error.config.url
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