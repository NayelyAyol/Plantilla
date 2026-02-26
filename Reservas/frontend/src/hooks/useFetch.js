import axios from "axios"
import { toast } from "react-toastify"

export function useFetch() {
    const fetchData = async (endpoint, data = undefined, method = "GET", extraHeaders = {}) => {
        const loadingToast = toast.loading("Procesando solicitud...");

        try {
            const token = localStorage.getItem("token");

            const config = {
                url: `${import.meta.env.VITE_API_URL}${endpoint}`,
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                    ...extraHeaders
                },
            };

            // Solo agregar data si existe y método lo permite
            if (data && method !== "GET") {
                config.data = data;
            }

            const response = await axios(config);

            toast.dismiss(loadingToast);
            return response.data;
        } catch (error) {
            toast.dismiss(loadingToast);
            throw error;
        }
    };

    return fetchData;
}