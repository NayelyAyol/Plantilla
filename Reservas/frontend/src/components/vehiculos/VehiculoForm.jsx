import { useState, useEffect } from "react";

const VehiculoForm = ({ initialData = {}, onSubmit, loading = false, isEdit = false }) => {
    const [form, setForm] = useState({
        marca: "",
        modelo: "",
        anio_fabricacion: "",
        placa: "",
        color: "",
        tipo_vehiculo: "",
        kilometraje: "",
        descripcion: ""
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setForm({
                ...initialData,
                anio_fabricacion: initialData.anio_fabricacion || "",
                kilometraje: initialData.kilometraje || "",
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
        const requiredFields = ["marca", "modelo", "anio_fabricacion", "placa", "color", "tipo_vehiculo", "kilometraje"];

        for (const field of requiredFields) {
            if (!form[field]?.toString().trim()) newErrors[field] = "Campo obligatorio";
        }

        const anioActual = new Date().getFullYear();
        if (form.anio_fabricacion && (form.anio_fabricacion < 1950 || form.anio_fabricacion > anioActual)) {
            newErrors.anio_fabricacion = `Debe estar entre 1950 y ${anioActual}`;
        }

        if (form.placa && form.placa.length !== 7) {
            newErrors.placa = "La placa debe tener 7 caracteres";
        }

        if (form.kilometraje && form.kilometraje < 0) {
            newErrors.kilometraje = "Kilometraje no puede ser negativo";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit({
                ...form,
                anio_fabricacion: Number(form.anio_fabricacion),
                kilometraje: Number(form.kilometraje),
                placa: form.placa.toUpperCase()
            });
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/40 max-w-4xl mx-auto"
        >
            <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                {isEdit ? "Editar Vehículo" : "Crear Vehículo"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Marca" name="marca" value={form.marca} onChange={handleChange} error={errors.marca} placeholder="Ej: Toyota" autoFocus />
                <Input label="Modelo" name="modelo" value={form.modelo} onChange={handleChange} error={errors.modelo} placeholder="Ej: Corolla" />
                <Input label="Año de fabricación" name="anio_fabricacion" type="number" value={form.anio_fabricacion} onChange={handleChange} error={errors.anio_fabricacion} placeholder="Ej: 2020" />
                <Input label="Placa" name="placa" value={form.placa} onChange={handleChange} error={errors.placa} maxLength={7} placeholder="Ej: ABC1234" />
                <Input label="Color" name="color" value={form.color} onChange={handleChange} error={errors.color} placeholder="Ej: Rojo" />
                <Input label="Tipo de vehículo" name="tipo_vehiculo" value={form.tipo_vehiculo} onChange={handleChange} error={errors.tipo_vehiculo} placeholder="Ej: Sedan, SUV" />
                <Input label="Kilometraje" name="kilometraje" type="number" value={form.kilometraje} onChange={handleChange} error={errors.kilometraje} placeholder="Ej: 12000" />
                <Input label="Descripción" name="descripcion" value={form.descripcion} onChange={handleChange} error={errors.descripcion} placeholder="Descripción adicional del vehículo" className="col-span-1 md:col-span-2" />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="mt-10 w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300"
            >
                {loading ? "Guardando..." : isEdit ? "Actualizar Vehículo" : "Crear Vehículo"}
            </button>
        </form>
    );
};

// ---------------------------
// INPUT CON TOOLTIP FLOTANTE
// ---------------------------
const Input = ({ label, error, placeholder, ...props }) => (
    <div className="relative">
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

export default VehiculoForm;