import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { toast } from "react-toastify";

const StudentList = () => {
    const navigate = useNavigate();
    const fetchData = useFetch();

    const [estudiantes, setEstudiantes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [busqueda, setBusqueda] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);

    // Obtener estudiantes
    const obtenerEstudiantes = async () => {
        try {
            setLoading(true);
            const data = await fetchData("/estudiantes/listar");

            if (data?.error) {
                toast.error(data.error);
                setEstudiantes([]);
                return;
            }

            setEstudiantes(data?.estudiantes || []);
        } catch (error) {
            toast.error("Error al cargar estudiantes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerEstudiantes();
    }, []);

    // Buscar estudiante
    const buscarEstudiante = async () => {
        const valor = busqueda.trim();

        if (!valor) {
            toast.error("Ingrese una cédula o apellido");
            return;
        }

        try {
            setLoading(true);

            const esNumero = /^\d+$/.test(valor);
            const url = esNumero
                ? `/estudiantes/buscar?cedula=${valor}`
                : `/estudiantes/buscar?apellido=${valor}`;

            const data = await fetchData(url);

            if (!data?.estudiantes || data.estudiantes.length === 0) {
                toast.warning("No se encontraron estudiantes");
                setEstudiantes([]);
                return;
            }

            setEstudiantes(data.estudiantes);
            toast.success("Resultados encontrados");
        } catch (error) {
            toast.error("Error en la búsqueda");
        } finally {
            setLoading(false);
        }
    };

    // Modal
    const openDeleteModal = (student) => {
        setStudentToDelete(student);
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
        setStudentToDelete(null);
    };

    // Confirmar eliminación
    const confirmDelete = async () => {
        if (!studentToDelete) return;

        try {
            // Asegurarse que _id esté limpio
            const id = studentToDelete._id.trim();

            const data = await fetchData(`/estudiantes/eliminar/${id}`, undefined, "DELETE");

            toast.success(data?.message || "Estudiante eliminado correctamente");

            closeModal();
            obtenerEstudiantes();
        } catch (error) {
            toast.error(
                error.response?.data?.error || "Error al eliminar estudiante"
            );
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex justify-center items-start p-8">
            {/* CUADRO BLANCO REDUCIDO */}
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-5xl flex flex-col max-h-[550px]">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Lista de Estudiantes
                    </h2>
                    <button
                        onClick={() => navigate("/estudiantes/crear")}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                    >
                        + Nuevo Estudiante
                    </button>
                </div>

                {/* BUSCADOR */}
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por cédula o apellido"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                        onClick={buscarEstudiante}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                        Buscar
                    </button>
                    <button
                        onClick={() => {
                            setBusqueda("");
                            obtenerEstudiantes();
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
                    ) : estudiantes.length === 0 ? (
                        <p className="text-gray-500 text-center py-6">
                            No hay estudiantes registrados
                        </p>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 text-xs uppercase text-gray-600 sticky top-0 z-10">
                                <tr>
                                    <th className="p-3">Nombre</th>
                                    <th className="p-3">Cédula</th>
                                    <th className="p-3">Teléfono</th>
                                    <th className="p-3">Ciudad</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estudiantes.map((est) => (
                                    <tr key={est._id} className="border-t hover:bg-gray-50">
                                        <td className="p-3">{est.nombre} {est.apellido}</td>
                                        <td className="p-3">{est.cedula}</td>
                                        <td className="p-3">{est.telefono}</td>
                                        <td className="p-3">{est.ciudad || "N/A"}</td>
                                        <td className="p-3">{est.email}</td>
                                        <td className="p-3 flex justify-center gap-3">
                                            <button
                                                onClick={() => navigate(`/estudiantes/actualizar/${est._id}`)}
                                                className="bg-yellow-500 px-3 py-1 rounded text-white hover:bg-yellow-600"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(est)}
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
                            ¿Seguro que desea eliminar a{" "}
                            <span className="font-semibold">
                                {studentToDelete?.nombre} {studentToDelete?.apellido}
                            </span>?
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

export default StudentList;