import axios from 'axios';
const API_URL = 'http://localhost:3000/api/socios';

export const sociosService = {
    // Ahora acepta un parámetro booleano para traer inactivos
    obtenerTodos: async (traerInactivos = false) => {
        // Si traerInactivos es true, llama a ?inactivos=true
        const url = traerInactivos ? `${API_URL}?inactivos=true` : API_URL;
        const response = await axios.get(url);
        return response.data;
    },
    crear: async (datos) => {
        const response = await axios.post(API_URL, datos);
        return response.data;
    },
    eliminar: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    },
    actualizar: async (id, datos) => {
        const response = await axios.put(`${API_URL}/${id}`, datos);
        return response.data;
    },

    // --- NUEVA FUNCIÓN ---
    actualizarPago: async (idPago, datos) => {
        const response = await axios.put(`${API_URL}/pagos/${idPago}`, datos);
        return response.data;
    },
    // --- NUEVOS MÉTODOS ---
    reactivar: async (id) => {
        const response = await axios.put(`${API_URL}/${id}/reactivar`);
        return response.data;
    },
    renovar: async (id, datosRenovacion) => {
        // datosRenovacion debe tener { fechaPago, metodoPago }
        const response = await axios.post(`${API_URL}/${id}/renovar`, datosRenovacion);
        return response.data;
    },
    // ... dentro del objeto sociosService ...
    obtenerEstadisticas: async () => {
        const response = await axios.get(`${API_URL}/estadisticas`);
        return response.data;
    }
    // ...
};