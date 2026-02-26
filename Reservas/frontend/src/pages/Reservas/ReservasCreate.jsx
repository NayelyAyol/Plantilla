import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useFetch } from "../../hooks/useFetch"
import ReservaForm from "../../components/reservas/ReservaForm"

const ReservaCreate = () => {
    const fetchData = useFetch()
    const navigate = useNavigate()
    const [clientes, setClientes] = useState([])
    const [vehiculos, setVehiculos] = useState([])
    const [loading, setLoading] = useState(true)

    const loadOptions = async () => {
        try {
            setLoading(true)
            const [clientesResp, vehiculosResp] = await Promise.all([
                fetchData("/clientes/listar"),
                fetchData("/vehiculos/listar")
            ])
            setClientes(clientesResp)
            setVehiculos(vehiculosResp)
        } catch (err) {
            toast.error(err.response?.data?.msg || "Error al cargar opciones")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadOptions()
    }, [])

    const handleCreate = async (data) => {
        try {
            const response = await fetchData("/reservas/crear", data, "POST")

            if (response) {
                toast.success("Reserva creada correctamente")

                setTimeout(() => {
                    navigate("/reservas/listar")
                }, 1000)
            }
        } catch (err) {
            toast.error(err.response?.data?.msg || "Error al crear reserva")
        }
    }

    if (loading) return <p className="text-center mt-6">Cargando opciones...</p>

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-6">
            <ReservaForm
                onSubmit={handleCreate}
                clientes={clientes}
                vehiculos={vehiculos}
            />
        </div>
    )
}

export default ReservaCreate