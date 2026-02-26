const API_URL = import.meta.env.VITE_API_URL

export const endpoints = {
    login: `${API_URL}/login`,
    estudiantes: `${API_URL}/estudiantes`,
    materias: `${API_URL}/materias`,
    matriculas: `${API_URL}/matriculas`
}

export default API_URL
