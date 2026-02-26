import { useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VehiculoList = () => {
    const fetchData = useFetch();
    const navigate = useNavigate();

    const [vehiculos, setVehiculos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [vehiculoToDelete, setVehiculoToDelete] = useState(null);

    // ================================
    // OBTENER TODOS LOS VEHÍCULOS
    // ================================
    const obtenerVehiculos = async () => {
        try {
            setLoading(true);
            const res = await fetchData("/vehiculos/listar");
            setVehiculos(res?.vehiculos || []);
        } catch (error) {
            toast.error("Error al cargar vehículos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerVehiculos();
    }, []);

    // ================================
    // BUSCAR VEHÍCULO POR PLACA O MARCA
    // ================================
    // ================================
    // BUSCAR VEHÍCULO POR PLACA
    // ================================
    const buscarVehiculo = async () => {
        const placa = busqueda.trim().toUpperCase(); // Convertimos a mayúsculas como tu esquema
        if (!placa) {
            toast.error("Ingrese la placa para buscar");
            return;
        }

        try {
            setLoading(true);
            const res = await fetchData(`/vehiculos/buscar?placa=${placa}`);

            if (!res?.vehiculos || res.vehiculos.length === 0) {
                toast.warning("No se encontraron vehículos con esa placa");
                setVehiculos([]);
                return;
            }

            setVehiculos(res.vehiculos);
            toast.success("Vehículo encontrado");
        } catch (error) {
            toast.error(error?.error || "Error en la búsqueda");
        } finally {
            setLoading(false);
        }
    };

    // ================================
    // ELIMINAR VEHÍCULO
    // ================================
    const openDeleteModal = (vehiculo) => {
        setVehiculoToDelete(vehiculo);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setVehiculoToDelete(null);
    };

    const confirmDelete = async () => {
        if (!vehiculoToDelete) return;
        try {
            await fetchData(`/vehiculos/eliminar/${vehiculoToDelete._id}`, undefined, "DELETE");
            toast.success("Vehículo eliminado correctamente");
            closeModal();
            obtenerVehiculos();
        } catch (error) {
            toast.error(error?.response?.data?.error || "Error al eliminar vehículo");
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6 flex flex-col items-center">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-6xl mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Lista de Vehículos</h2>
                <button
                    onClick={() => navigate("/vehiculos/crear")}
                    className="bg-rose-600 text-white px-5 py-2 rounded-lg hover:bg-rose-700"
                >
                    + Nuevo Vehículo
                </button>
            </div>

            {/* BUSCADOR */}
            <div className="flex gap-2 mb-4 w-full max-w-6xl">
                <input
                    type="text"
                    placeholder="Buscar por placa o marca"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 outline-none"
                />
                <button
                    onClick={buscarVehiculo}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg transition"
                >
                    Buscar
                </button>
                <button
                    onClick={() => {
                        setBusqueda("");
                        obtenerVehiculos();
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                    Reset
                </button>
            </div>

            {/* TABLA */}
            <div className="w-full max-w-6xl overflow-x-auto">
                {loading ? (
                    <p className="text-gray-500 text-center py-6">Cargando vehículos...</p>
                ) : vehiculos.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">No hay vehículos registrados</p>
                ) : (
                    <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden text-left text-sm">
                        <thead className="bg-gradient-to-r from-rose-500 to-orange-500 text-white">
                            <tr>
                                <th className="p-3">Marca</th>
                                <th className="p-3">Modelo</th>
                                <th className="p-3">Placa</th>
                                <th className="p-3">Color</th>
                                <th className="p-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehiculos.map(vehiculo => (
                                <tr key={vehiculo._id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{vehiculo.marca}</td>
                                    <td className="p-3">{vehiculo.modelo}</td>
                                    <td className="p-3">{vehiculo.placa}</td>
                                    <td className="p-3">{vehiculo.color}</td>
                                    <td className="p-3 text-center flex justify-center gap-2">
                                        <button
                                            onClick={() => navigate(`/vehiculos/actualizar/${vehiculo._id}`)}
                                            className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded transition"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(vehiculo)}
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
                            ¿Seguro que desea eliminar el vehículo{" "}
                            <span className="font-semibold">{vehiculoToDelete?.placa}</span>?
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
    );
};

export default VehiculoList;