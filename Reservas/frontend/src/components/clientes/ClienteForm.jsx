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
        email: ""
    })

    const [errors, setErrors] = useState({}) // Para mostrar mensajes flotantes

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

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
        setErrors(prev => ({ ...prev, [e.target.name]: "" })) // limpiar error al escribir
    }

    // ====================
    // VALIDACIONES
    // ====================
    const validate = () => {
        const newErrors = {}
        const requiredFields = ["nombre","apellido","cedula","fecha_nacimiento","ciudad","direccion","email"]

        for (const field of requiredFields) {
            if (!form[field]?.trim()) newErrors[field] = "Campo obligatorio"
        }

        if (form.cedula && !/^\d{10}$/.test(form.cedula)) {
            newErrors.cedula = "La cédula debe tener 10 dígitos"
        }

        if (form.telefono && !/^\d{7}$|^\d{10}$/.test(form.telefono)) {
            newErrors.telefono = "Teléfono debe tener 7 o 10 dígitos"
        }

        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Formato de email inválido"
        }

        if (form.fecha_nacimiento) {
            const hoy = new Date()
            const nacimiento = new Date(form.fecha_nacimiento)
            const edad = hoy.getFullYear() - nacimiento.getFullYear() - ((hoy.getMonth() < nacimiento.getMonth() || (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate())) ? 1 : 0)
            if (edad < 18) newErrors.fecha_nacimiento = "Debe ser mayor de 18 años"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) onSubmit(form)
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
            </div>

            <button
                type="submit"
                disabled={loading}
                className="mt-10 w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300"
            >
                {loading ? "Guardando..." : isEdit ? "Actualizar Cliente" : "Crear Cliente"}
            </button>
        </form>
    )
}

// ---------------------------
// INPUT CON TOOLTIP FLOTANTE
// ---------------------------
const Input = ({ label, error, ...props }) => (
    <div className="relative">
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
            {...props}
            className={`w-full px-4 py-2 rounded-xl border ${error ? "border-red-500" : "border-gray-300"} focus:ring-2 ${error ? "focus:ring-red-400" : "focus:ring-rose-400"} outline-none transition`}
        />
        {error && (
            <div className="absolute top-0 right-0 mt-1 mr-0 bg-rose-100 text-rose-800 text-xs px-2 py-1 rounded shadow-lg z-10">
                {error}
            </div>
        )}
    </div>
)

export default ClienteForm