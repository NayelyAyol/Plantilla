import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";

const EnrollmentList = () => {
    const fetchData = useFetch();
    const navigate = useNavigate();

    const [matriculas, setMatriculas] = useState([]);
    const [busqueda, setBusqueda] = useState({
        codigo: "",
        estudiante: "",
        materia: ""
    });
    const [loading, setLoading] = useState(true);

    // Modal de eliminación
    const [showModal, setShowModal] = useState(false);
    const [matriculaToDelete, setMatriculaToDelete] = useState(null);

    // ================================
    // CARGAR MATRÍCULAS
    // ================================
    const obtenerMatriculas = async () => {
        try {
            setLoading(true);
            const data = await fetchData("/matriculas/listar");
            setMatriculas(data || []);
        } catch {
            toast.error("Error al cargar matrículas");
            setMatriculas([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerMatriculas();
    }, []);

    // ================================
    // BÚSQUEDA AVANZADA
    // ================================
    const buscar = async () => {
        const { codigo, estudiante, materia } = busqueda;
        if (!codigo && !estudiante && !materia) {
            toast.info("Ingrese al menos un criterio de búsqueda");
            return;
        }

        try {
            setLoading(true);
            const query = new URLSearchParams(busqueda).toString();
            const res = await fetchData(`/matriculas/buscarMatricula?${query}`);
            if (res?.matriculas && res.matriculas.length > 0) {
                setMatriculas(res.matriculas);
                toast.success("Resultados encontrados");
            } else {
                setMatriculas([]);
                toast.warning("No se encontraron matrículas");
            }
        } catch {
            toast.error("Error del servidor al buscar");
        } finally {
            setLoading(false);
        }
    };

    // ================================
    // MODAL ELIMINACIÓN
    // ================================
    const openDeleteModal = (matricula) => {
        setMatriculaToDelete(matricula);
        setShowModal(true);
    };

    const closeModal = () => {
        setMatriculaToDelete(null);
        setShowModal(false);
    };

    const confirmDelete = async () => {
        if (!matriculaToDelete) return;
        try {
            await fetchData(
                `/matriculas/eliminar/${matriculaToDelete._id}`,
                undefined,
                "DELETE"
            );
            toast.success("Matrícula eliminada correctamente");
            closeModal();
            obtenerMatriculas();
        } catch {
            toast.error("Error al eliminar matrícula");
        }
    };

    // ================================
    // RENDER
    // ================================
    if (loading)
        return (
            <div className="p-8 text-center text-gray-600">
                Cargando matrículas...
            </div>
        );

    return (
        <div className="bg-gray-100 min-h-screen flex justify-center p-8">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-5xl flex flex-col">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Lista de Matrículas
                    </h2>
                    <button
                        onClick={() => navigate("/matriculas/crear")}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                    >
                        + Nueva Matrícula
                    </button>
                </div>

                {/* FILTROS */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Código"
                        value={busqueda.codigo}
                        onChange={(e) =>
                            setBusqueda({ ...busqueda, codigo: e.target.value })
                        }
                        className="border rounded p-2 flex-1"
                    />
                    <input
                        type="text"
                        placeholder="Estudiante (nombre, apellido o cédula)"
                        value={busqueda.estudiante}
                        onChange={(e) =>
                            setBusqueda({ ...busqueda, estudiante: e.target.value })
                        }
                        className="border rounded p-2 flex-1"
                    />
                    <input
                        type="text"
                        placeholder="Materia (nombre o código)"
                        value={busqueda.materia}
                        onChange={(e) =>
                            setBusqueda({ ...busqueda, materia: e.target.value })
                        }
                        className="border rounded p-2 flex-1"
                    />
                    <button
                        onClick={buscar}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Buscar
                    </button>
                    <button
                        onClick={obtenerMatriculas}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Limpiar
                    </button>
                </div>

                {/* TABLA */}
                <div className="overflow-x-auto">
                    {matriculas.length === 0 ? (
                        <p className="text-center text-gray-500 py-6">
                            No hay matrículas registradas
                        </p>
                    ) : (
                        <table className="min-w-full border-collapse text-left mx-auto">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3">Código</th>
                                    <th className="px-6 py-3">Estudiante</th>
                                    <th className="px-6 py-3">Materia</th>
                                    <th className="px-6 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {matriculas.map((m) => (
                                    <tr key={m._id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-2">{m.codigo}</td>
                                        <td className="px-6 py-2">
                                            {m.estudiante?.nombre} {m.estudiante?.apellido} - {m.estudiante?.cedula}
                                        </td>
                                        <td className="px-6 py-2">{m.materia?.nombre} ({m.materia?.codigo})</td>
                                        <td className="px-6 py-2 flex gap-2">
                                            <button
                                                onClick={() =>
                                                    navigate(`/matriculas/actualizar/${m._id}`)
                                                }
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
                            ¿Seguro que desea eliminar la matrícula{" "}
                            <span className="font-semibold">{matriculaToDelete?.codigo}</span> de{" "}
                            <span className="font-semibold">{matriculaToDelete?.estudiante?.nombre} {matriculaToDelete?.estudiante?.apellido}</span>?
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

export default EnrollmentList;