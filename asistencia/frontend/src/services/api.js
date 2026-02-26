const API_URL = import.meta.env.VITE_API_URL

export const endpoints = {
    login: `${API_URL}/auth/login`,
    registro: `${API_URL}/auth/register`,
    estudiantes: `${API_URL}/clientes`,
    materias: `${API_URL}/tickets`,
    matriculas: `${API_URL}/tecnicos`
}

export default API_URL
