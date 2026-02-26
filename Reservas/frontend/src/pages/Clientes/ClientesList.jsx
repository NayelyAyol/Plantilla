import { useEffect, useState } from "react"
import { useFetch } from "../../hooks/useFetch"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

const ClienteList = () => {

    const fetchData = useFetch()
    const navigate = useNavigate()

    const [clientes, setClientes] = useState([])
    const [loading, setLoading] = useState(false)
    const [busqueda, setBusqueda] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [clienteToDelete, setClienteToDelete] = useState(null)

    // ================================
    // OBTENER TODOS LOS CLIENTES
    // ================================
    const obtenerClientes = async () => {
        try {
            setLoading(true)
            const res = await fetchData("/clientes/listar")
            setClientes(res.clientes || [])
        } catch (error) {
            toast.error("Error al cargar clientes")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        obtenerClientes()
    }, [])

    // ================================
    // BUSCAR CLIENTE
    // ================================
    const buscarCliente = async () => {
        const valor = busqueda.trim()
        if (!valor) {
            toast.error("Ingrese una cédula o apellido")
            return
        }

        try {
            setLoading(true)
            const esNumero = /^\d+$/.test(valor)
            const url = esNumero
                ? `/clientes/buscar?cedula=${valor}`
                : `/clientes/buscar?apellido=${valor}`

            const res = await fetchData(url)

            if (!res?.clientes || res.clientes.length === 0) {
                toast.warning("No se encontraron clientes")
                setClientes([])
                return
            }

            setClientes(res.clientes)
            toast.success("Resultados encontrados")
        } catch (error) {
            toast.error("Error en la búsqueda")
        } finally {
            setLoading(false)
        }
    }

    // ================================
    // ELIMINAR CLIENTE
    // ================================
    const openDeleteModal = (cliente) => {
        setClienteToDelete(cliente)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setClienteToDelete(null)
    }

    const confirmDelete = async () => {
        if (!clienteToDelete) return
        try {
            await fetchData(`/clientes/eliminar/${clienteToDelete._id}`, undefined, "DELETE")
            toast.success("Cliente eliminado correctamente")
            closeModal()
            obtenerClientes()
        } catch (error) {
            toast.error(error?.response?.data?.error || "Error al eliminar cliente")
        }
    }

    return (
        <div className="bg-gray-100 min-h-screen p-8 flex flex-col items-center">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-6xl mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Lista de Clientes</h2>
                <button
                    onClick={() => navigate("/clientes/crear")}
                    className="bg-rose-600 text-white px-5 py-2 rounded-lg hover:bg-rose-700"
                >
                    + Nuevo Cliente
                </button>
            </div>

            {/* BUSCADOR */}
            <div className="flex gap-2 mb-4 w-full max-w-6xl">
                <input
                    type="text"
                    placeholder="Buscar por cédula o apellido"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 outline-none"
                />
                <button
                    onClick={buscarCliente}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg transition"
                >
                    Buscar
                </button>
                <button
                    onClick={() => {
                        setBusqueda("")
                        obtenerClientes()
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                    Reset
                </button>
            </div>

            {/* TABLA */}
            <div className="w-full max-w-6xl overflow-x-auto">
                {loading ? (
                    <p className="text-gray-500 text-center py-6">Cargando clientes...</p>
                ) : clientes.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">No hay clientes registrados</p>
                ) : (
                    <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden text-left text-sm">
                        <thead className="bg-gradient-to-r from-rose-500 to-orange-500 text-white">
                            <tr>
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Cédula</th>
                                <th className="p-3">Teléfono</th>
                                <th className="p-3">Ciudad</th>
                                <th className="p-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map(cliente => (
                                <tr key={cliente._id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{cliente.nombre} {cliente.apellido}</td>
                                    <td className="p-3">{cliente.cedula}</td>
                                    <td className="p-3">{cliente.telefono}</td>
                                    <td className="p-3">{cliente.ciudad}</td>
                                    <td className="p-3 text-center flex justify-center gap-2">
                                        <button
                                            onClick={() => navigate(`/clientes/actualizar/${cliente._id}`)}
                                            className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-lg transition"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(cliente)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
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
                            ¿Seguro que desea eliminar a{" "}
                            <span className="font-semibold">{clienteToDelete?.nombre} {clienteToDelete?.apellido}</span>?
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

export default ClienteList