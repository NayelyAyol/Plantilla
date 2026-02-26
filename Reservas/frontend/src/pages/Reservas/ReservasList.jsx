import { useEffect, useState } from "react"
import { useFetch } from "../../hooks/useFetch"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

const ReservaList = () => {
    const fetchData = useFetch()
    const navigate = useNavigate()

    const [reservas, setReservas] = useState([])
    const [loading, setLoading] = useState(false)
    const [busqueda, setBusqueda] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [reservaToDelete, setReservaToDelete] = useState(null)

    // ================================
    // OBTENER TODAS LAS RESERVAS
    // ================================
    const obtenerReservas = async () => {
        try {
            setLoading(true)
            const res = await fetchData("/reservas/listar")
            setReservas(res || [])
        } catch (error) {
            toast.error("Error al cargar reservas")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        obtenerReservas()
    }, [])

    // ================================
    // BUSCAR POR CÓDIGO
    // ================================
    const buscarReserva = async () => {
        const codigo = busqueda.trim()
        if (!codigo) {
            toast.error("Ingrese un código de reserva")
            return
        }

        try {
            setLoading(true)
            const res = await fetchData(`/reservas/buscar?codigo=${codigo}`)
            if (!res?.reservas || res.reservas.length === 0) {
                toast.warning("No se encontraron reservas")
                setReservas([])
                return
            }
            setReservas(res.reservas)
            toast.success("Resultados encontrados")
        } catch (error) {
            toast.error("Error en la búsqueda")
        } finally {
            setLoading(false)
        }
    }

    // ================================
    // ELIMINAR RESERVA
    // ================================
    const openDeleteModal = (reserva) => {
        setReservaToDelete(reserva)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setReservaToDelete(null)
    }

    const confirmDelete = async () => {
        if (!reservaToDelete) return
        try {
            await fetchData(`/reservas/eliminar/${reservaToDelete._id}`, undefined, "DELETE")
            toast.success("Reserva eliminada correctamente")
            closeModal()
            obtenerReservas()
        } catch (error) {
            toast.error(error?.response?.data?.error || "Error al eliminar reserva")
        }
    }

    return (
        <div className="bg-gray-100 min-h-screen p-6 flex flex-col items-center">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-6xl mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Lista de Reservas</h2>
                <button
                    onClick={() => navigate("/reservas/crear")}
                    className="bg-rose-600 text-white px-5 py-2 rounded-lg hover:bg-rose-700"
                >
                    + Nueva Reserva
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
                    onClick={buscarReserva}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg transition"
                >
                    Buscar
                </button>
                <button
                    onClick={() => {
                        setBusqueda("")
                        obtenerReservas()
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                    Reset
                </button>
            </div>

            {/* TABLA */}
            <div className="w-full max-w-6xl overflow-x-auto">
                {loading ? (
                    <p className="text-gray-500 text-center py-6">Cargando reservas...</p>
                ) : reservas.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">No hay reservas registradas</p>
                ) : (
                    <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden text-left text-sm">
                        <thead className="bg-gradient-to-r from-rose-500 to-orange-500 text-white">
                            <tr>
                                <th className="p-3">Código</th>
                                <th className="p-3">Cliente</th>
                                <th className="p-3">Vehículo</th>
                                <th className="p-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservas.map(reserva => (
                                <tr key={reserva._id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{reserva.codigo}</td>
                                    <td className="p-3">{reserva.cliente?.nombre} {reserva.cliente?.apellido}</td>
                                    <td className="p-3">{reserva.vehiculo?.marca} {reserva.vehiculo?.modelo}</td>
                                    <td className="p-3 text-center flex justify-center gap-2">
                                        <button
                                            onClick={() => navigate(`/reservas/actualizar/${reserva._id}`)}
                                            className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded transition"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(reserva)}
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
                            ¿Seguro que desea eliminar la reserva{" "}
                            <span className="font-semibold">{reservaToDelete?.codigo}</span>?
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

export default ReservaList