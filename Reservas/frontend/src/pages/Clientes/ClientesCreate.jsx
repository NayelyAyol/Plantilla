import ClienteForm from "../../components/clientes/ClienteForm"
import { useFetch } from "../../hooks/useFetch"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

const ClienteCreate = () => {

    const fetchData = useFetch()
    const navigate = useNavigate()

    const handleCreate = async (data) => {
        try {
            await fetchData("/clientes/crear", data, "POST")
            toast.success("Cliente creado correctamente")
            navigate("/clientes/listar")
        } catch (error) {
            toast.error(error.response?.data?.error || "Error al crear")
        }
    }

    return (
        <ClienteForm onSubmit={handleCreate} />
    )
}

export default ClienteCreate