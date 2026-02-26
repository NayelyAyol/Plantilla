import { useState, useEffect } from "react"

const ClienteForm = ({
    initialData = {},
    onSubmit,
    loading = false,
    isEdit = false
}) => {

    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        cedula: "",
        fecha_nacimiento: "",
        ciudad: "",
        direccion: "",
        telefono: "",
        email: "",
        dependencia: ""
    })

    const [errors, setErrors] = useState({})

    // ================================
    // CARGAR DATOS EN EDICIÓN
    // ================================
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setForm({
                ...initialData,
                fecha_nacimiento: initialData.fecha_nacimiento
                    ? initialData.fecha_nacimiento.split("T")[0]
                    : ""
            })
        }
    }, [initialData])

    // ================================
    // MANEJO DE INPUTS
    // ================================
    const handleChange = (e) => {
        const { name, value } = e.target

        let newValue = value

        // Solo permitir números en cédula y teléfono
        if (name === "cedula" || name === "telefono") {
            newValue = value.replace(/\D/g, "")
        }

        setForm({
            ...form,
            [name]: newValue
        })

        setErrors(prev => ({
            ...prev,
            [name]: ""
        }))
    }

    // ================================
    // VALIDACIONES
    // ================================
    const validate = () => {
        const newErrors = {}

        const requiredFields = [
            "nombre",
            "apellido",
            "cedula",
            "fecha_nacimiento",
            "ciudad",
            "direccion",
            "telefono",
            "email",
            "dependencia"
        ]

        // Campos obligatorios
        for (const field of requiredFields) {
            if (!form[field]?.trim()) {
                newErrors[field] = "Campo obligatorio"
            }
        }

        // Cédula 10 dígitos
        if (form.cedula && !/^\d{10}$/.test(form.cedula)) {
            newErrors.cedula = "La cédula debe tener 10 dígitos"
        }

        // Teléfono 10 dígitos
        if (form.telefono && !/^\d{10}$/.test(form.telefono)) {
            newErrors.telefono = "El teléfono debe tener 10 dígitos"
        }

        // Email válido
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Formato de email inválido"
        }

        // Edad entre 16 y 100 años (igual que backend)
        if (form.fecha_nacimiento) {
            const hoy = new Date()
            const nacimiento = new Date(form.fecha_nacimiento)

            const fechaMinima = new Date()
            fechaMinima.setFullYear(hoy.getFullYear() - 100)

            const fechaMaxima = new Date()
            fechaMaxima.setFullYear(hoy.getFullYear() - 16)

            if (nacimiento < fechaMinima || nacimiento > fechaMaxima) {
                newErrors.fecha_nacimiento = "La edad debe estar entre 16 y 100 años"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // ================================
    // SUBMIT
    // ================================
    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            onSubmit(form)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/40 max-w-4xl mx-auto"
        >
            <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                {isEdit ? "Editar Cliente" : "Crear Cliente"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <Input label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} error={errors.nombre} autoFocus />
                <Input label="Apellido" name="apellido" value={form.apellido} onChange={handleChange} error={errors.apellido} />
                <Input label="Cédula" name="cedula" value={form.cedula} onChange={handleChange} error={errors.cedula} maxLength={10} />
                <Input label="Fecha de nacimiento" name="fecha_nacimiento" type="date" value={form.fecha_nacimiento} onChange={handleChange} error={errors.fecha_nacimiento} />
                <Input label="Ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} error={errors.ciudad} />
                <Input label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} error={errors.direccion} />
                <Input label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} error={errors.telefono} maxLength={10} />
                <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
                <Input label="Dependencia" name="dependencia" value={form.dependencia} onChange={handleChange} error={errors.dependencia} />

            </div>

            <button
                type="submit"
                disabled={loading}
                className="mt-10 w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-60"
            >
                {loading
                    ? "Guardando..."
                    : isEdit
                        ? "Actualizar Cliente"
                        : "Crear Cliente"}
            </button>
        </form>
    )
}

// ================================
// INPUT CON TOOLTIP FLOTANTE
// ================================
const Input = ({ label, error, ...props }) => (
    <div className="relative">
        <label className="block text-sm font-medium mb-1">
            {label}
        </label>

        <input
            {...props}
            className={`w-full px-4 py-2 rounded-xl border ${
                error ? "border-red-500" : "border-gray-300"
            } focus:ring-2 ${
                error ? "focus:ring-red-400" : "focus:ring-rose-400"
            } outline-none transition`}
        />

        {error && (
            <div className="absolute top-0 right-0 mt-1 bg-rose-100 text-rose-800 text-xs px-2 py-1 rounded shadow-lg z-10">
                {error}
            </div>
        )}
    </div>
)

export default ClienteForm