import axios from 'axios';
import id from 'vue-cal/dist/i18n/id.es.js';

// URL base de tu backend .NET
//const API_URL = 'https://app-eiramind.azurewebsites.net/api';
const API_URL = 'http://localhost:3000';

// Crear instancia de axios con configuración global
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para agregar token a las solicitudes
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de autenticación
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expirado o inválido
            authService.logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    async login(email, password) {
        try {
            console.log('🔍 Intentando login con:', { email, password });
            // console.log('📡 Endpoint:', `${API_URL}/Users/login`);

            // 1. Primero intentar login como User (paciente)
            // const loginResponse = await axiosInstance.post('/Users/login', {
            //     email: email,
            //     password: password
            // });

            // console.log('✅ Respuesta del login:', loginResponse.data);

            const userRes = await axiosInstance.get(`/users?email=${email}&password=${password}`);

            // if (loginResponse.data && loginResponse.data.success) {
            //     // Usuario encontrado en Users
            //     const userData = loginResponse.data.data;
            //     this.saveAuthData(userData, 'patient');
            //     console.log('👤 Usuario logueado (paciente):', userData);
            //     return true;
            // }

            if (userRes.data && userRes.data.length > 0) {
                const user = userRes.data[0]; // Asumimos que el backend devuelve un array de usuarios
                console.log('✅ Paciente encontrado:', user);

                const authData = {
                    id: user.id,
                    email: user.email,
                    nombre: user.nombre,
                    tipo: user.tipo || 'paciente',
                    token: this.generateMockToken(user.id, user.email, 'patient'),
                    tokenExpiration: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
                };
                
                this.saveAuthData(authData, 'patient');
                return true;
            }
        


            // 2. Si no es User, intentar como Psychologist
            console.log('🔄 Buscando como psicólogo...');
            const psychologistsResponse = await axiosInstance.get('/Psychologists');
            console.log('📊 Psicólogos disponibles:', psychologistsResponse.data);

            if (psychologistsResponse.data && psychologistsResponse.data.success) {
                const psychologists = psychologistsResponse.data.data;
                const psychologist = psychologists.find(p =>
                    p.email.toLowerCase() === email.toLowerCase() &&
                    p.password === password
                );

                if (psychologist) {
                    // Para psicólogos, crear un objeto similar al LoginResponse
                    const psychologistAuth = {
                        Id: psychologist.id,
                        Email: psychologist.email,
                        Nombre: psychologist.nombre,
                        Tipo: 'psicologo',
                        Token: this.generateMockToken(psychologist.id, psychologist.email, 'psicologo'),
                        TokenExpiration: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 horas
                    };

                    this.saveAuthData(psychologistAuth, 'psychologist');
                    console.log('👨‍⚕️ Psicólogo logueado:', psychologistAuth);
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

    saveAuthData(userData, userType) {
        localStorage.setItem('token', userData.Token);
        localStorage.setItem('tokenExpiration', userData.TokenExpiration);
        localStorage.setItem('user', JSON.stringify({
            id: userData.Id,
            email: userData.Email,
            nombre: userData.Nombre,
            tipo: userData.Tipo
        }));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userType', userType);
        localStorage.setItem('userId', userData.Id);
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
    },

    isAuthenticated() {
        const token = localStorage.getItem('token');
        const expiration = localStorage.getItem('tokenExpiration');

        if (!token || !expiration) return false;

        // Verificar si el token ha expirado
        const now = new Date();
        const expirationDate = new Date(expiration);

        if (now > expirationDate) {
            this.logout();
            return false;
        }

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
    },

    getToken() {
        return localStorage.getItem('token');
    },

    // Método temporal para generar token mock para psicólogos
    // Esto debería ser reemplazado por un endpoint de login para psicólogos en el backend
    generateMockToken(userId, email, userType) {
        // En producción, esto debe venir del backend
        // Esto es solo temporal hasta que implementes login para psicólogos
        return `mock_token_${userId}_${email}_${userType}_${Date.now()}`;
    },

    // Método para refrescar el token (implementar cuando lo necesites)
    async refreshToken() {
        // Implementar lógica para refrescar el token
        console.log('Refrescando token...');
        // Esta función debería llamar a un endpoint en el backend para refrescar el token
    }
};

// Exportar la instancia de axios configurada
export { axiosInstance };