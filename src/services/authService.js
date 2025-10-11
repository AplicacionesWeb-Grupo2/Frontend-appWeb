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

export const registerUser = async (userData) => {
    const res = await fetch('http://localhost:3000/users');
    const users = await res.json();

    // Validar si el correo ya está registrado
    const exists = users.find(u => u.email === userData.email);
    if (exists) {
        throw new Error('El correo ya está registrado. Intenta con otro.');
    }

    // Crear nuevo usuario
    const newUser = {
        ...userData,
        createdAt: new Date().toISOString()
    };

    const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
    });

    if (!response.ok) {
        throw new Error('Error al registrar el usuario.');
    }

    return await response.json();
};

