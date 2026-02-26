import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { useFetch } from "../../hooks/useFetch"
import ClienteForm from "../../components/clientes/ClienteForm"

const ClienteEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const fetchData = useFetch()

    const [cliente, setCliente] = useState(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    // ================================
    // OBTENER CLIENTE
    // ================================
    const obtenerCliente = async () => {
        try {
            const data = await fetchData(`/clientes/buscarid/${id}`)

            if (!data?.cliente) {
                toast.error("Cliente no encontrado")
                navigate("/clientes/listar")
                return
            }

            setCliente(data.cliente)

        } catch (error) {
            toast.error("Error al cargar el cliente")
            navigate("/clientes/listar")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!id) {
            toast.error("ID inválido")
            navigate("/clientes/listar")
            return
        }

        obtenerCliente()
    }, [id])

    // ================================
    // ACTUALIZAR CLIENTE
    // ================================
    const handleUpdate = async (formData) => {
        try {
            setUpdating(true)

            const res = await fetchData(
                `/clientes/actualizar/${id}`,
                formData,
                "PUT"
            )

            if (res?.error) {
                toast.error(res.error)
                return
            }

            toast.success("Cliente actualizado correctamente")

            setTimeout(() => {
                navigate("/clientes/listar")
            }, 1200)

        } catch (error) {
            toast.error("Error del servidor")
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="animate-pulse text-gray-500">
                    Cargando cliente...
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-6">
            <ClienteForm
                initialData={cliente}
                onSubmit={handleUpdate}
                loading={updating}
                isEdit={true}
            />
        </div>
    )
}

export default ClienteEdit