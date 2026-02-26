import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";

const SubjectCreate = () => {
    const navigate = useNavigate();
    const fetchData = useFetch();

    const initialState = {
        nombre: "",
        codigo: "",
        descripcion: "",
        creditos: ""
    };

    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const validarFormulario = () => {
        if (!form.nombre.trim()) return "El nombre es obligatorio";
        if (form.nombre.length < 2) return "El nombre debe tener al menos 2 caracteres";
        if (!form.codigo.trim()) return "El código es obligatorio";
        if (!form.descripcion.trim()) return "La descripción es obligatoria";
        if (!form.creditos || form.creditos <= 0) return "Los créditos deben ser un número mayor a 0";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errorValidacion = validarFormulario();
        if (errorValidacion) {
            toast.error(errorValidacion);
            return;
        }

        try {
            setLoading(true);
            const res = await fetchData("/materias/crear", form, "POST");
            if (res?.error) {
                toast.error(res.error);
                return;
            }
            toast.success(res?.message || "Materia creada correctamente");
            setForm(initialState);
            navigate("/materias");
        } catch (error) {
            toast.error("Error del servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-4xl">
                <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-left">
                    Crear Nueva Materia
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre *</label>
                        <input
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            placeholder="Ej: Diseño de Interfaces"
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
                        />
                    </div>

                    {/* Código */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Código *</label>
                        <input
                            type="text"
                            name="codigo"
                            value={form.codigo}
                            onChange={handleChange}
                            placeholder="Ej: D2D"
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
                        />
                    </div>

                    {/* Descripción */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Descripción *</label>
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            placeholder="Breve descripción de la materia"
                            className="w-full border rounded-lg px-4 py-2 h-28 resize-none focus:ring-2 focus:ring-blue-600 outline-none"
                        />
                    </div>

                    {/* Créditos */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Créditos *</label>
                        <input
                            type="number"
                            name="creditos"
                            value={form.creditos}
                            onChange={handleChange}
                            placeholder="Ej: 4"
                            min="1"
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
                        />
                    </div>

                    {/* Botón */}
                    <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 rounded-lg text-white transition 
                                ${loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {loading ? "Guardando..." : "Crear Materia"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubjectCreate;