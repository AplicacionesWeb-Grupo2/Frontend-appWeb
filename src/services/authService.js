import axios from 'axios';

// URL base de tu backend .NET
const API_URL = 'http://localhost:5293/api';

export const authService = {
    async login(email, password) {
        try {
            console.log('🔍 Intentando login con:', { email, password });
            console.log('📡 Endpoint:', `${API_URL}/Users/login`);

            // 1. Primero intentar login como User (paciente)
            const loginResponse = await axios.post(`${API_URL}/Users/login`, {
                email: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('✅ Respuesta del login:', loginResponse.data);

            if (loginResponse.data && loginResponse.data.success) {
                // Usuario encontrado en Users
                const userData = loginResponse.data.data;
                const userWithoutPassword = {
                    ...userData,
                    userType: 'patient'
                };

                localStorage.setItem('user', JSON.stringify(userWithoutPassword));
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userType', 'patient');
                localStorage.setItem('userId', userData.id);

                console.log('👤 Usuario logueado (paciente):', userWithoutPassword);
                return true;
            }

            // 2. Si no es User, intentar como Psychologist
            console.log('🔄 Buscando como psicólogo...');
            const psychologistsResponse = await axios.get(`${API_URL}/Psychologists`);
            console.log('📊 Psicólogos disponibles:', psychologistsResponse.data);

            if (psychologistsResponse.data && psychologistsResponse.data.success) {
                const psychologists = psychologistsResponse.data.data;
                const psychologist = psychologists.find(p =>
                    p.email.toLowerCase() === email.toLowerCase() &&
                    p.password === password
                );

                if (psychologist) {
                    const psychologistWithoutPassword = {
                        ...psychologist,
                        userType: 'psychologist'
                    };
                    delete psychologistWithoutPassword.password;

                    localStorage.setItem('user', JSON.stringify(psychologistWithoutPassword));
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('userType', 'psychologist');
                    localStorage.setItem('userId', psychologist.id);

                    console.log('👨‍⚕️ Psicólogo logueado:', psychologistWithoutPassword);
                    return true;
                }
            }

            console.log('❌ Credenciales no válidas');
            return false;

        } catch (error) {
            console.error('🚨 Error en login:', error);

            // Mostrar detalles del error
            if (error.response) {
                console.error('📡 Error response:', error.response.data);
                console.error('🔢 Status:', error.response.status);
            }

            throw error;
        }
    },

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
    },

    isAuthenticated() {
        return localStorage.getItem('isAuthenticated') === 'true';
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getUserType() {
        return localStorage.getItem('userType');
    },

    getUserId() {
        return localStorage.getItem('userId');
    }
};