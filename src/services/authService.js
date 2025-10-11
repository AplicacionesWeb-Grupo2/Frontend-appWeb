// src/services/authService.js
const API_URL = 'http://localhost:3000/users';

export const authService = {
    async login(email, password) {
        try {
            const res = await fetch(`${API_URL}?email=${email}&password=${password}`);
            const data = await res.json();

            if (data.length > 0) {
                const user = data[0];
                localStorage.setItem('auth', 'true');
                localStorage.setItem('user', JSON.stringify(user));
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            return false;
        }
    },

    logout() {
        localStorage.removeItem('auth');
        localStorage.removeItem('user');
    },

    isAuthenticated() {
        return localStorage.getItem('auth') === 'true';
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};
