// frontend/src/services/api.js
import axios from 'axios';

// Creamos una instancia "base" de Axios
const api = axios.create({
    baseURL: 'http://localhost:3000/api', // La URL de tu backend en Express
    timeout: 5000, // Si tarda más de 5s, corta
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;