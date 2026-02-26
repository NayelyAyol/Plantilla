import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { useFetch } from "../../hooks/useFetch"

const ClienteEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const fetchData = useFetch()

    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        cedula: "",
        fecha_nacimiento: "",
        telefono: "",
        email: "",
        direccion: "",
        ciudad: ""
    })

    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    // ================================
    // OBTENER CLIENTE
    // ================================
    const obtenerCliente = async () => {
        try {
            const data = await fetchData("/clientes/listar")

            if (!data?.clientes) {
                toast.error("No se pudieron obtener los clientes")
                navigate("/clientes/listar")
                return
            }

            const cliente = data.clientes.find(c => c._id === id)

            if (!cliente) {
                toast.error("Cliente no encontrado")
                navigate("/clientes/listar")
                return
            }

            setForm({
                nombre: cliente.nombre || "",
                apellido: cliente.apellido || "",
                cedula: cliente.cedula || "",
                fecha_nacimiento: cliente.fecha_nacimiento
                    ? cliente.fecha_nacimiento.split("T")[0]
                    : "",
                telefono: cliente.telefono || "",
                email: cliente.email || "",
                direccion: cliente.direccion || "",
                ciudad: cliente.ciudad || ""
            })
        } catch (error) {
            toast.error("Error del servidor al cargar cliente")
            navigate("/clientes/listar")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!id) {
            toast.error("ID inválido")
            navigate("/clientes/listar")
            return
        }

        obtenerCliente()
    }, [])

    // ================================
    // MANEJO INPUTS
    // ================================
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    // ================================
    // VALIDACIÓN CLIENTE
    // ================================
    const validarFormulario = () => {
        if (!form.nombre.trim()) return "El nombre es obligatorio"
        if (!form.apellido.trim()) return "El apellido es obligatorio"
        if (!/^\d{10}$/.test(form.cedula)) return "La cédula debe tener 10 dígitos"
        if (!form.fecha_nacimiento) return "La fecha de nacimiento es obligatoria"

        // Validación de edad mínima
        const fechaNacimiento = new Date(form.fecha_nacimiento)
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)
        if (fechaNacimiento >= hoy) return "La fecha de nacimiento no puede ser actual ni futura"

        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
        const mes = hoy.getMonth() - fechaNacimiento.getMonth()
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) edad--
        if (edad < 18) return "El cliente debe tener al menos 18 años"

        if (!form.direccion.trim()) return "La dirección es obligatoria"
        if (!form.ciudad.trim()) return "La ciudad es obligatoria"
        if (!form.email.trim()) return "El email es obligatorio"
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Formato de email inválido"
        if (form.telefono && !/^[0-9]{7,15}$/.test(form.telefono)) return "El teléfono debe tener entre 7 y 15 números"

        return null
    }

    // ================================
    // ACTUALIZAR CLIENTE
    // ================================
    const handleSubmit = async (e) => {
        e.preventDefault()

        const errorValidacion = validarFormulario()
        if (errorValidacion) {
            toast.error(errorValidacion)
            return
        }

        try {
            setUpdating(true)

            const res = await fetchData(
                `/clientes/actualizar/${id}`,
                form,
                "PUT"
            )

            if (res?.error) {
                toast.error(res.error)
                return
            }

            if (res?.message) {
                toast.success(res.message)
                setTimeout(() => navigate("/clientes/listar"), 1200)
                return
            }

            toast.error("Respuesta inesperada del servidor")
        } catch (error) {
            if (error?.response?.data?.error) toast.error(error.response.data.error)
            else toast.error("Error del servidor")
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-500 animate-pulse">Cargando cliente...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-4 flex justify-center">
            <div className="w-full max-w-4xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                    Editar Cliente
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {["nombre", "apellido", "cedula", "fecha_nacimiento", "telefono", "email", "ciudad", "direccion"].map(field => (
                        <div key={field} className={field === "direccion" ? "md:col-span-2" : ""}>
                            <label className="block text-gray-700 mb-1 capitalize">{field.replace("_", " ")}</label>
                            <input
                                type={
                                    field === "email" ? "email" :
                                        field === "fecha_nacimiento" ? "date" : "text"
                                }
                                name={field}
                                value={form[field]}
                                onChange={handleChange}
                                max={field === "fecha_nacimiento" ? new Date().toISOString().split("T")[0] : undefined}
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                required={field !== "telefono" && field !== "ciudad"}
                            />
                        </div>
                    ))}

                    <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/clientes/listar")}
                            className="px-6 py-2 rounded-xl bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={updating}
                            className={`px-6 py-2 rounded-xl text-white ${updating ? "bg-gray-400 cursor-not-allowed" : "bg-rose-500 hover:bg-rose-600"
                                }`}
                        >
                            {updating ? "Actualizando..." : "Guardar Cambios"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default ClienteEdit