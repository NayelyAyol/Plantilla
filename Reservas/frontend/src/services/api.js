const API_URL = import.meta.env.VITE_API_URL

export const endpoints = {
    login: `${API_URL}/auth/login`,
    registro: `${API_URL}/auth/register`,
    estudiantes: `${API_URL}/vehiculos`,
    materias: `${API_URL}/clientes`,
    matriculas: `${API_URL}/reservas`
}

export default API_URL
