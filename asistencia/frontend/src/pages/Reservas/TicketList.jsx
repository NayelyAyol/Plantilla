import { useEffect, useState } from "react"
import { useFetch } from "../../hooks/useFetch"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

const TicketList = () => {
    const fetchData = useFetch()
    const navigate = useNavigate()

    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(false)
    const [busqueda, setBusqueda] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [ticketToDelete, setTicketToDelete] = useState(null)

    // ================================
    // OBTENER TODOS LOS TICKETS
    // ================================
    const obtenerTickets = async () => {
        try {
            setLoading(true)
            const res = await fetchData("/tickets/listar")
            setTickets(res || [])
        } catch (error) {
            toast.error("Error al cargar tickets")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        obtenerTickets()
    }, [])

    // ================================
    // BUSCAR POR CÓDIGO
    // ================================
    const buscarTicket = async () => {
        const codigo = busqueda.trim()
        if (!codigo) {
            toast.error("Ingrese un código de ticket")
            return
        }

        try {
            setLoading(true)
            const res = await fetchData(`/tickets/buscar?codigo=${codigo}`)
            if (!res?.ticket) {
                toast.warning("No se encontraron tickets")
                setTickets([])
                return
            }
            setTickets([res.ticket])
            toast.success("Resultado encontrado")
        } catch (error) {
            toast.error("Error en la búsqueda")
        } finally {
            setLoading(false)
        }
    }

    // ================================
    // ELIMINAR TICKET
    // ================================
    const openDeleteModal = (ticket) => {
        setTicketToDelete(ticket)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setTicketToDelete(null)
    }

    const confirmDelete = async () => {
        if (!ticketToDelete) return
        try {
            await fetchData(`/tickets/eliminar/${ticketToDelete._id}`, undefined, "DELETE")
            toast.success("Ticket eliminado correctamente")
            closeModal()
            obtenerTickets()
        } catch (error) {
            toast.error(error?.response?.data?.msg || "Error al eliminar ticket")
        }
    }

    return (
        <div className="bg-gray-100 min-h-screen p-6 flex flex-col items-center">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-6xl mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Lista de Tickets</h2>
                <button
                    onClick={() => navigate("/tickets/crear")}
                    className="bg-rose-600 text-white px-5 py-2 rounded-lg hover:bg-rose-700"
                >
                    + Nuevo Ticket
                </button>
            </div>

            {/* BUSCADOR */}
            <div className="flex gap-2 mb-4 w-full max-w-6xl">
                <input
                    type="text"
                    placeholder="Buscar por código"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 outline-none"
                />
                <button
                    onClick={buscarTicket}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg transition"
                >
                    Buscar
                </button>
                <button
                    onClick={() => {
                        setBusqueda("")
                        obtenerTickets()
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                    Reset
                </button>
            </div>

            {/* TABLA */}
            <div className="w-full max-w-6xl overflow-x-auto">
                {loading ? (
                    <p className="text-gray-500 text-center py-6">Cargando tickets...</p>
                ) : tickets.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">No hay tickets registrados</p>
                ) : (
                    <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden text-left text-sm">
                        <thead className="bg-gradient-to-r from-rose-500 to-orange-500 text-white">
                            <tr>
                                <th className="p-3">Código</th>
                                <th className="p-3">Cliente</th>
                                <th className="p-3">Técnico</th>
                                <th className="p-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map(ticket => (
                                <tr key={ticket._id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{ticket.codigo}</td>
                                    <td className="p-3">{ticket.cliente?.nombre} {ticket.cliente?.apellido}</td>
                                    <td className="p-3">{ticket.tecnico?.nombre} {ticket.tecnico?.apellido}</td>
                                    <td className="p-3 text-center flex justify-center gap-2">
                                        <button
                                            onClick={() => navigate(`/tickets/actualizar/${ticket._id}`)}
                                            className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded transition"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(ticket)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* MODAL ELIMINAR */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-gradient-to-br from-rose-100 via-orange-100 to-amber-100 rounded-2xl shadow-2xl p-6 w-96 border border-rose-200">
                        <h3 className="text-lg font-bold mb-4 text-rose-700">Confirmar Eliminación</h3>
                        <p className="mb-6 text-black-400">
                            ¿Seguro que desea eliminar el ticket{" "}
                            <span className="font-semibold">{ticketToDelete?.codigo}</span>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white rounded transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded transition"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TicketList