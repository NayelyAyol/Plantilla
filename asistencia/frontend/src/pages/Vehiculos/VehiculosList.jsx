import { useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TecnicoList = () => {
    const fetchData = useFetch();
    const navigate = useNavigate();

    const [tecnicos, setTecnicos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [tecnicoToDelete, setTecnicoToDelete] = useState(null);

    // ================================
    // OBTENER TODOS LOS TÉCNICOS
    // ================================
    const obtenerTecnicos = async () => {
        try {
            setLoading(true);
            const res = await fetchData("/tecnicos/listar");
            setTecnicos(res?.tecnicos || []);
        } catch (error) {
            toast.error("Error al cargar técnicos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerTecnicos();
    }, []);

    // ================================
    // BUSCAR TÉCNICO POR CÉDULA
    // ================================
    const buscarTecnico = async () => {
        const cedula = busqueda.trim();
        if (!cedula) {
            toast.error("Ingrese la cédula para buscar");
            return;
        }

        try {
            setLoading(true);
            const res = await fetchData(`/tecnicos/buscar?cedula=${cedula}`);

            if (!res?.tecnicos || res.tecnicos.length === 0) {
                toast.warning("No se encontraron técnicos con esa cédula");
                setTecnicos([]);
                return;
            }

            setTecnicos(res.tecnicos);
            toast.success("Técnico encontrado");
        } catch (error) {
            toast.error(error?.error || "Error en la búsqueda");
        } finally {
            setLoading(false);
        }
    };

    // ================================
    // ELIMINAR TÉCNICO
    // ================================
    const openDeleteModal = (tecnico) => {
        setTecnicoToDelete(tecnico);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setTecnicoToDelete(null);
    };

    const confirmDelete = async () => {
        if (!tecnicoToDelete) return;
        try {
            await fetchData(`/tecnicos/eliminar/${tecnicoToDelete._id}`, undefined, "DELETE");
            toast.success("Técnico eliminado correctamente");
            closeModal();
            obtenerTecnicos();
        } catch (error) {
            toast.error(error?.response?.data?.error || "Error al eliminar técnico");
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6 flex flex-col items-center">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-6xl mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Lista de Técnicos</h2>
                <button
                    onClick={() => navigate("/tecnicos/crear")}
                    className="bg-rose-600 text-white px-5 py-2 rounded-lg hover:bg-rose-700"
                >
                    + Nuevo Técnico
                </button>
            </div>

            {/* BUSCADOR */}
            <div className="flex gap-2 mb-4 w-full max-w-6xl">
                <input
                    type="text"
                    placeholder="Buscar por cédula"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-rose-500 outline-none"
                />
                <button
                    onClick={buscarTecnico}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg transition"
                >
                    Buscar
                </button>
                <button
                    onClick={() => {
                        setBusqueda("");
                        obtenerTecnicos();
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                    Reset
                </button>
            </div>

            {/* TABLA */}
            <div className="w-full max-w-6xl overflow-x-auto">
                {loading ? (
                    <p className="text-gray-500 text-center py-6">Cargando técnicos...</p>
                ) : tecnicos.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">No hay técnicos registrados</p>
                ) : (
                    <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden text-left text-sm">
                        <thead className="bg-gradient-to-r from-rose-500 to-orange-500 text-white">
                            <tr>
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Apellido</th>
                                <th className="p-3">Cédula</th>
                                <th className="p-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tecnicos.map(tecnico => (
                                <tr key={tecnico._id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{tecnico.nombre}</td>
                                    <td className="p-3">{tecnico.apellido}</td>
                                    <td className="p-3">{tecnico.cedula}</td>
                                    <td className="p-3 text-center flex justify-center gap-2">
                                        <button
                                            onClick={() => navigate(`/tecnicos/actualizar/${tecnico._id}`)}
                                            className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded transition"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(tecnico)}
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
                            ¿Seguro que desea eliminar al técnico{" "}
                            <span className="font-semibold">{tecnicoToDelete?.nombre} {tecnicoToDelete?.apellido}</span>?
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

export default TecnicoList;