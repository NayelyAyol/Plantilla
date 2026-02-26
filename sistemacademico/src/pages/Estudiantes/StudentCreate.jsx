import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { toast } from "react-toastify";

const StudentCreate = () => {

    const fetchData = useFetch();
    const navigate = useNavigate();

    const initialState = {
        nombre: "",
        apellido: "",
        cedula: "",
        fecha_nacimiento: "",
        ciudad: "",
        direccion: "",
        telefono: "",
        email: ""
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
        if (!form.apellido.trim()) return "El apellido es obligatorio";
        if (form.apellido.length < 2) return "El apellido debe tener al menos 2 caracteres";
        if (!/^\d{10}$/.test(form.cedula)) return "La cédula debe tener exactamente 10 dígitos";
        if (!form.fecha_nacimiento) return "La fecha de nacimiento es obligatoria";

        const fechaNacimiento = new Date(form.fecha_nacimiento);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fechaNacimiento >= hoy) return "La fecha de nacimiento no puede ser actual ni futura";

        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        const mes = hoy.getMonth() - fechaNacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) edad--;
        if (edad < 15) return "El estudiante debe tener al menos 15 años";

        if (!form.ciudad.trim()) return "La ciudad es obligatoria";
        if (!form.direccion.trim()) return "La dirección es obligatoria";
        if (!form.email.trim()) return "El email es obligatorio";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Formato de email inválido";
        if (form.telefono && !/^[0-9]{7,10}$/.test(form.telefono)) return "El teléfono debe contener entre 7 y 10 números";

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
            const res = await fetchData(`/estudiantes/crear`, form, "POST");
            if (res?.error) {
                toast.error(res.error);
                return;
            }
            if (res?.msg || res?.message) {
                toast.success("Estudiante creado correctamente");
                setForm(initialState);
                return;
            }
            toast.error("Respuesta inesperada del servidor");
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
                    Crear Nuevo Estudiante
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.keys(form).map((key) => (
                        <div key={key}>
                            <label className="block text-sm font-medium mb-1 capitalize">
                                {key.replace("_", " ")} *
                            </label>
                            <input
                                type={
                                    key === "fecha_nacimiento"
                                        ? "date"
                                        : key === "email"
                                            ? "email"
                                            : "text"
                                }
                                name={key}
                                value={form[key]}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600 outline-none"
                            />
                        </div>
                    ))}

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
                            {loading ? "Guardando..." : "Guardar Estudiante"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentCreate;