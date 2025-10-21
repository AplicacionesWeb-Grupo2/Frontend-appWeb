import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const authService = {
    async login(email, password) {
        try {
            const response = await axios.get(`${API_URL}/users`);
            const users = response.data;
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                const userWithoutPassword = { ...user };
                delete userWithoutPassword.password;
                localStorage.setItem('user', JSON.stringify(userWithoutPassword));
                localStorage.setItem('isAuthenticated', 'true');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
    },

    isAuthenticated() {
        return localStorage.getItem('isAuthenticated') === 'true';
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
};
