import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";

const SubjectEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fetchData = useFetch();

    const [form, setForm] = useState({
        nombre: "",
        codigo: "",
        descripcion: "",
        creditos: ""
    });

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    // ✅ TRAER TODAS Y FILTRAR POR ID
    useEffect(() => {
        const cargarMateria = async () => {
            try {
                setLoadingData(true);

                const data = await fetchData("/materias/listar");
                const materias = data?.materias || [];

                const materiaSeleccionada = materias.find(
                    (m) => m._id === id
                );

                if (!materiaSeleccionada) {
                    toast.error("Materia no encontrada");
                    navigate("/materias");
                    return;
                }

                setForm({
                    nombre: materiaSeleccionada.nombre || "",
                    codigo: materiaSeleccionada.codigo || "",
                    descripcion: materiaSeleccionada.descripcion || "",
                    creditos: materiaSeleccionada.creditos || ""
                });

            } catch (error) {
                toast.error("Error al cargar la materia");
                navigate("/materias");
            } finally {
                setLoadingData(false);
            }
        };

        if (id) cargarMateria();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validarFormulario = () => {
        if (!form.nombre.trim()) return "El nombre es obligatorio";
        if (!form.codigo.trim()) return "El código es obligatorio";
        if (!form.descripcion.trim()) return "La descripción es obligatoria";
        if (!form.creditos || Number(form.creditos) <= 0)
            return "Los créditos deben ser mayores que 0";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const error = validarFormulario();
        if (error) return toast.error(error);

        try {
            setLoading(true);

            await fetchData(
                `/materias/actualizar/${id}`,
                form,
                "PUT"
            );

            toast.success("Materia actualizada correctamente");
            navigate("/materias");

        } catch (error) {
            toast.error("Error al actualizar materia");
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="p-8 text-center text-gray-600">
                Cargando materia...
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 bg-gray-100 min-h-screen flex justify-center">

            <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 w-full max-w-4xl">

                <h2 className="text-2xl font-bold mb-6">
                    Editar Materia
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >

                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Código */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Código
                        </label>
                        <input
                            type="text"
                            name="codigo"
                            value={form.codigo}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Descripción */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">
                            Descripción
                        </label>
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            rows="3"
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        />
                    </div>

                    {/* Créditos */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Créditos
                        </label>
                        <input
                            type="number"
                            name="creditos"
                            value={form.creditos}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* BOTONES */}
                    <div className="md:col-span-2 flex justify-end gap-4 mt-4">

                        <button
                            type="button"
                            onClick={() => navigate("/materias")}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 text-white rounded 
                            ${loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                                }`}
                        >
                            {loading ? "Actualizando..." : "Actualizar"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default SubjectEdit;