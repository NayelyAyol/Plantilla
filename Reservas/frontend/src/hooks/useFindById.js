import { useEffect, useState } from "react"
import { useFetch } from "./useFetch"

export const useFindById = ({
    endpoint,
    id,
    arrayKey = null,   // clientes, vehiculos, reservas, etc
    idField = "_id"    // Mongo usa _id
}) => {

    const fetchData = useFetch()

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {

        if (!id) return

        const fetchAndFind = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await fetchData(endpoint)

                // 🔥 Normalizar estructura
                const list = arrayKey ? response[arrayKey] : response

                if (!Array.isArray(list)) {
                    throw new Error("La respuesta no contiene un array válido")
                }

                const item = list.find(
                    element => element[idField]?.toString() === id.toString()
                )

                if (!item) {
                    throw new Error("Registro no encontrado")
                }

                setData(item)

            } catch (err) {
                setError(err.message || "Error al buscar registro")
                setData(null)
            } finally {
                setLoading(false)
            }
        }

        fetchAndFind()

    }, [endpoint, id])

    return { data, loading, error }
} 