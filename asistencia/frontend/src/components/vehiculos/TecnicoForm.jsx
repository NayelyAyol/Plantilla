import { useState, useEffect } from "react";

const TecnicoForm = ({ initialData = {}, onSubmit, loading = false, isEdit = false }) => {
    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        cedula: "",
        fecha_nacimiento: "",
        genero: "",
        ciudad: "",
        direccion: "",
        telefono: "",
        email: ""
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setForm({
                ...initialData,
                fecha_nacimiento: initialData.fecha_nacimiento
                    ? new Date(initialData.fecha_nacimiento).toISOString().split("T")[0]
                    : ""
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        const requiredFields = ["nombre","apellido","cedula","fecha_nacimiento","genero","direccion","telefono","email","ciudad"];

        for (const field of requiredFields) {
            if (!form[field]?.toString().trim()) newErrors[field] = "Campo obligatorio";
        }

        // Validaciones específicas
        if (form.cedula && (!/^\d{10}$/.test(form.cedula))) {
            newErrors.cedula = "La cédula debe tener 10 números";
        }

        if (form.telefono && (!/^\d{10}$/.test(form.telefono))) {
            newErrors.telefono = "El teléfono debe tener 10 números";
        }

        if (form.fecha_nacimiento) {
            const fecha = new Date(form.fecha_nacimiento);
            const hoy = new Date();
            const minFecha = new Date();
            minFecha.setFullYear(hoy.getFullYear() - 100);
            if (fecha > hoy || fecha < minFecha) {
                newErrors.fecha_nacimiento = "Edad inválida (0-100 años)";
            }
        }

        if (form.genero && !["Masculino","Femenino","Otro"].includes(form.genero)) {
            newErrors.genero = "Género inválido";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(form);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/40 max-w-4xl mx-auto"
        >
            <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                {isEdit ? "Editar Técnico" : "Crear Técnico"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} error={errors.nombre} placeholder="Ej: Juan" autoFocus />
                <Input label="Apellido" name="apellido" value={form.apellido} onChange={handleChange} error={errors.apellido} placeholder="Ej: Pérez" />
                <Input label="Cédula" name="cedula" value={form.cedula} onChange={handleChange} error={errors.cedula} placeholder="Ej: 1234567890" maxLength={10} />
                <Input label="Fecha de nacimiento" name="fecha_nacimiento" type="date" value={form.fecha_nacimiento} onChange={handleChange} error={errors.fecha_nacimiento} />
                <Select label="Género" name="genero" value={form.genero} onChange={handleChange} error={errors.genero} options={["Masculino","Femenino","Otro"]} />
                <Input label="Ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} error={errors.ciudad} placeholder="Ej: Quito" />
                <Input label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} error={errors.direccion} placeholder="Ej: Av. Siempre Viva 123" />
                <Input label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} error={errors.telefono} placeholder="Ej: 0987654321" maxLength={10} />
                <Input label="Email" name="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="Ej: correo@ejemplo.com" className="col-span-1 md:col-span-2" />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="mt-10 w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300"
            >
                {loading ? "Guardando..." : isEdit ? "Actualizar Técnico" : "Crear Técnico"}
            </button>
        </form>
    );
};

// ---------------------------
// INPUT CON TOOLTIP FLOTANTE
// ---------------------------
const Input = ({ label, error, placeholder, className, ...props }) => (
    <div className={`relative ${className || ""}`}>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
            {...props}
            placeholder={placeholder}
            className={`w-full px-4 py-2 rounded-xl border ${error ? "border-red-500" : "border-gray-300"} focus:ring-2 ${error ? "focus:ring-red-400" : "focus:ring-rose-400"} outline-none transition`}
        />
        {error && (
            <div className="absolute top-0 right-0 mt-1 mr-0 bg-rose-100 text-rose-800 text-xs px-2 py-1 rounded shadow-lg z-10">
                {error}
            </div>
        )}
    </div>
);

const Select = ({ label, name, value, onChange, options, error }) => (
    <div className="relative">
        <label className="block text-sm font-medium mb-1">{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-2 rounded-xl border ${error ? "border-red-500" : "border-gray-300"} focus:ring-2 ${error ? "focus:ring-red-400" : "focus:ring-rose-400"} outline-none transition`}
        >
            <option value="">Seleccione...</option>
            {options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
        {error && (
            <div className="absolute top-0 right-0 mt-1 mr-0 bg-rose-100 text-rose-800 text-xs px-2 py-1 rounded shadow-lg z-10">
                {error}
            </div>
        )}
    </div>
);

export default TecnicoForm;