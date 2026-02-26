import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useFetch } from "../../hooks/useFetch"
import { toast } from "react-toastify"

const StudentEdit = () => {

    const { id } = useParams()
    const navigate = useNavigate()
    const fetchData = useFetch()

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

    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    // ================================
    // OBTENER ESTUDIANTE
    // ================================
    const obtenerEstudiante = async () => {
        try {

            const data = await fetchData("/estudiantes/listar")

            if (!data?.estudiantes) {
                toast.error("No se pudieron obtener los estudiantes")
                navigate("/estudiantes")
                return
            }

            const estudiante = data.estudiantes.find(est => est._id === id)

            if (!estudiante) {
                toast.error("Estudiante no encontrado")
                navigate("/estudiantes")
                return
            }

            setForm({
                nombre: estudiante.nombre || "",
                apellido: estudiante.apellido || "",
                cedula: estudiante.cedula || "",
                fecha_nacimiento: estudiante.fecha_nacimiento
                    ? estudiante.fecha_nacimiento.split("T")[0]
                    : "",
                ciudad: estudiante.ciudad || "",
                direccion: estudiante.direccion || "",
                telefono: estudiante.telefono || "",
                email: estudiante.email || ""
            })

        } catch (error) {
            toast.error("Error del servidor al cargar estudiante")
            navigate("/estudiantes")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!id) {
            toast.error("ID inválido")
            navigate("/estudiantes")
            return
        }

        obtenerEstudiante()
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
    // VALIDACIONES COMPLETAS
    // ================================
    const validarFormulario = () => {

        if (!form.nombre.trim())
            return "El nombre es obligatorio"

        if (form.nombre.length < 2)
            return "El nombre debe tener al menos 2 caracteres"

        if (!form.apellido.trim())
            return "El apellido es obligatorio"

        if (form.apellido.length < 2)
            return "El apellido debe tener al menos 2 caracteres"

        if (!/^\d{10}$/.test(form.cedula))
            return "La cédula debe tener exactamente 10 dígitos"

        if (!form.fecha_nacimiento)
            return "La fecha de nacimiento es obligatoria"

        const fechaNacimiento = new Date(form.fecha_nacimiento)
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)

        if (fechaNacimiento >= hoy)
            return "La fecha de nacimiento no puede ser actual ni futura"

        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
        const mes = hoy.getMonth() - fechaNacimiento.getMonth()

        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--
        }

        if (edad < 15)
            return "El estudiante debe tener al menos 15 años"

        if (!form.ciudad.trim())
            return "La ciudad es obligatoria"

        if (!form.direccion.trim())
            return "La dirección es obligatoria"

        if (!form.email.trim())
            return "El email es obligatorio"

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            return "Formato de email inválido"

        if (form.telefono && !/^[0-9]{7,15}$/.test(form.telefono))
            return "El teléfono debe contener entre 7 y 15 números"

        return null
    }

    // ================================
    // ACTUALIZAR
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
                `/estudiantes/actualizar/${id}`,
                form,
                "PUT"
            )

            if (res?.error) {
                toast.error(res.error)
                return
            }

            if (res?.message) {
                toast.success(res.message)

                setTimeout(() => {
                    navigate("/estudiantes")
                }, 1500)

                return
            }

            toast.error("Respuesta inesperada del servidor")

        } catch (error) {

            if (error?.response?.data?.error) {
                toast.error(error.response.data.error)
            } else {
                toast.error("Error del servidor")
            }

        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="p-8 text-center text-gray-600">
                Cargando estudiante...
            </div>
        )
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen flex justify-center">

            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-4xl">

                <h2 className="text-2xl font-bold mb-6">
                    Editar Estudiante
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >

                    {Object.keys(form).map((key) => (
                        <div key={key}>
                            <label className="block text-sm font-medium mb-1 capitalize">
                                {key.replace("_", " ")}
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
                                max={
                                    key === "fecha_nacimiento"
                                        ? new Date().toISOString().split("T")[0]
                                        : undefined
                                }
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    ))}

                    <div className="md:col-span-2 flex justify-end gap-4 mt-4">

                        <button
                            type="button"
                            onClick={() => navigate("/estudiantes")}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={updating}
                            className={`px-6 py-2 text-white rounded 
                                ${updating
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                                }`}
                        >
                            {updating ? "Actualizando..." : "Actualizar"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    )
}

export default StudentEdit