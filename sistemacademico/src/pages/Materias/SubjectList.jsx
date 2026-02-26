import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";

const SubjectList = () => {
    const navigate = useNavigate();
    const fetchData = useFetch();

    const [materias, setMaterias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [busqueda, setBusqueda] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [materiaToDelete, setMateriaToDelete] = useState(null);

    // Obtener materias
    const obtenerMaterias = async () => {
        try {
            setLoading(true);
            const data = await fetchData("/materias/listar");
            setMaterias(data?.materias || []);
        } catch (error) {
            toast.error("Error al cargar materias");
            setMaterias([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerMaterias();
    }, []);

    // Buscar materia por código o nombre
    const buscarMateria = async () => {
        const valor = busqueda.trim();
        if (!valor) {
            toast.error("Ingrese código o nombre");
            return;
        }

        try {
            setLoading(true);
            let data = [];

            const esCodigo = !valor.includes(" "); // si tiene espacio, es nombre
            if (esCodigo) {
                const resp = await fetchData(
                    `/materias/buscarMateria?codigo=${encodeURIComponent(valor)}`
                );
                data = resp?.materias || [];
            } else {
                const resp = await fetchData(
                    `/materias/buscarMateria?nombre=${encodeURIComponent(valor)}`
                );
                data = resp?.materias || [];
            }

            if (data.length === 0) {
                setMaterias([]);
                toast.warning("No se encontraron materias");
            } else {
                setMaterias(data);
                toast.success("Resultados encontrados");
            }
        } catch (error) {
            setMaterias([]);
            toast.error("Error al buscar materias");
        } finally {
            setLoading(false);
        }
    };

    // Modal
    const openDeleteModal = (materia) => {
        setMateriaToDelete(materia);
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
        setMateriaToDelete(null);
    };

    // Confirmar eliminación
    const confirmDelete = async () => {
        if (!materiaToDelete) return;
        try {
            await fetchData(`/materias/eliminar/${materiaToDelete._id}`, undefined, "DELETE");
            toast.success("Materia eliminada correctamente");
            closeModal();
            obtenerMaterias();
        } catch (error) {
            toast.error("Error al eliminar materia");
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex justify-center items-start p-8">
            {/* CUADRO BLANCO REDUCIDO */}
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-5xl flex flex-col max-h-[550px]">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Lista de Materias
                    </h2>
                    <button
                        onClick={() => navigate("/materias/crear")}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                    >
                        + Nueva Materia
                    </button>
                </div>

                {/* BUSCADOR */}
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por código o nombre"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                        onClick={buscarMateria}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                        Buscar
                    </button>
                    <button
                        onClick={() => {
                            setBusqueda("");
                            obtenerMaterias();
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                        Reset
                    </button>
                </div>

                {/* TABLA CON SCROLL */}
                <div className="flex-1 overflow-y-auto border rounded-lg">
                    {loading ? (
                        <p className="text-gray-500 text-center py-6">Cargando...</p>
                    ) : materias.length === 0 ? (
                        <p className="text-gray-500 text-center py-6">
                            No hay materias registradas
                        </p>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 text-xs uppercase text-gray-600 sticky top-0 z-10">
                                <tr>
                                    <th className="p-3">Nombre</th>
                                    <th className="p-3">Código</th>
                                    <th className="p-3">Créditos</th>
                                    <th className="p-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materias.map((m) => (
                                    <tr key={m._id} className="border-t hover:bg-gray-50">
                                        <td className="p-3">{m.nombre}</td>
                                        <td className="p-3">{m.codigo}</td>
                                        <td className="p-3">{m.creditos}</td>
                                        <td className="p-3 flex justify-center gap-3">
                                            <button
                                                onClick={() => navigate(`/materias/actualizar/${m._id}`)}
                                                className="bg-yellow-500 px-3 py-1 rounded text-white hover:bg-yellow-600"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(m)}
                                                className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600"
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
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-96">
                        <h3 className="text-lg font-bold mb-4">Confirmar Eliminación</h3>
                        <p className="mb-6 text-gray-600">
                            ¿Seguro que desea eliminar la materia{" "}
                            <span className="font-semibold">{materiaToDelete?.nombre}</span>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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

export default SubjectList;