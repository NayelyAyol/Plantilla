import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";

const EnrollmentEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fetchData = useFetch();

    const [form, setForm] = useState({
        codigo: "",
        descripcion: "",
        estudiante: "",
        materia: ""
    });

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [busquedaEstudiante, setBusquedaEstudiante] = useState("");
    const [busquedaMateria, setBusquedaMateria] = useState("");

    const [resultadoEstudiantes, setResultadoEstudiantes] = useState([]);
    const [resultadoMaterias, setResultadoMaterias] = useState([]);

    const [detalleEstudiante, setDetalleEstudiante] = useState(null);
    const [detalleMateria, setDetalleMateria] = useState(null);

    // ================================
    // CARGAR MATRÍCULA
    // ================================
    const obtenerMatricula = async () => {
        try {
            const data = await fetchData("/matriculas/listar");
            const matricula = data.find(m => m._id === id);

            if (!matricula) {
                toast.error("Matrícula no encontrada");
                navigate("/matriculas");
                return;
            }

            setForm({
                codigo: matricula.codigo || "",
                descripcion: matricula.descripcion || "",
                estudiante: matricula.estudiante?._id || "",
                materia: matricula.materia?._id || ""
            });

            setDetalleEstudiante(matricula.estudiante || null);
            setDetalleMateria(matricula.materia || null);
        } catch {
            toast.error("Error al cargar matrícula");
            navigate("/matriculas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) {
            toast.error("ID inválido");
            navigate("/matriculas");
            return;
        }
        obtenerMatricula();
    }, [id]);

    // BÚSQUEDA ESTUDIANTES Y MATERIAS
    const buscarEstudiante = async () => {
        const valor = busquedaEstudiante.trim();
        if (!valor) return toast.error("Ingrese cédula o apellido del estudiante");

        try {
            const esNumero = /^\d+$/.test(valor);
            const url = esNumero
                ? `/estudiantes/buscar?cedula=${valor}`
                : `/estudiantes/buscar?apellido=${valor}`;

            const data = await fetchData(url);
            if (!data?.estudiantes || data.estudiantes.length === 0) {
                setResultadoEstudiantes([]);
                return toast.info("No se encontraron estudiantes");
            }

            setResultadoEstudiantes(data.estudiantes);
        } catch {
            toast.error("Error al buscar estudiante");
        }
    };

    const buscarMateria = async () => {
        const valor = busquedaMateria.trim();
        if (!valor) return toast.error("Ingrese nombre o código de la materia");

        try {
            // Usamos 'nombre' porque el backend espera ?nombre=
            const query = new URLSearchParams({ nombre: valor }).toString();
            const res = await fetchData(`/materias/buscarMateria?${query}`);

            // El backend devuelve { materias: [...] }
            if (!res?.materias || res.materias.length === 0) {
                setResultadoMaterias([]);
                return toast.info("No se encontraron materias con ese nombre");
            }

            setResultadoMaterias(res.materias);
        } catch (error) {
            console.error(error);
            toast.error("Error del servidor al buscar materia");
        }
    };
    // SELECCIÓN
    const seleccionarEstudiante = (est) => {
        setDetalleEstudiante(est);
        setForm({ ...form, estudiante: est._id });
        setResultadoEstudiantes([]);
        setBusquedaEstudiante(`${est.nombre} ${est.apellido}`);
        toast.info("Estudiante seleccionado");
    };

    const seleccionarMateria = (mat) => {
        setDetalleMateria(mat);
        setForm({ ...form, materia: mat._id });
        setResultadoMaterias([]);
        setBusquedaMateria(`${mat.nombre} - ${mat.codigo}`);
        toast.info("Materia seleccionada");
    };

    // ================================
    // MANEJO INPUTS
    // ================================
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // VALIDACIÓN Y ACTUALIZACIÓN
    const validarFormulario = async () => {
        if (!form.codigo.trim()) return "El código es obligatorio";
        if (!form.codigo.includes("-")) return "El código debe contener un guion (-)";
        if (!form.estudiante) return "Debe seleccionar un estudiante";
        if (!detalleEstudiante || detalleEstudiante._id !== form.estudiante) return "Estudiante no válido";
        if (!form.materia) return "Debe seleccionar una materia";
        if (!detalleMateria || detalleMateria._id !== form.materia) return "Materia no válida";

        const data = await fetchData(
            `/matriculas/buscarMatricula?estudiante=${form.estudiante}&materia=${form.materia}`
        );
        if (data?.matriculas && data.matriculas.length > 0 && data.matriculas[0]._id !== id) {
            return "El estudiante ya está matriculado en esta materia";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.codigo.trim()) return toast.error("El código es obligatorio");
        if (!form.codigo.includes("-")) return toast.error("El código debe contener un guion (-)");

        if (!form.estudiante) return toast.error("Debe seleccionar un estudiante");
        if (!detalleEstudiante || detalleEstudiante._id !== form.estudiante) return toast.error("Estudiante no válido");

        if (!form.materia) return toast.error("Debe seleccionar una materia");
        if (!detalleMateria || detalleMateria._id !== form.materia) return toast.error("Materia no válida");

        try {
            setUpdating(true);
            const res = await fetchData(`/matriculas/actualizar/${id}`, form, "PUT");

            if (res?.msg) toast.success(res.msg);
            else toast.success("Matrícula actualizada correctamente");

            setTimeout(() => navigate("/matriculas"), 1200);
        } catch (error) {
            toast.error(error?.msg || "Error del servidor");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-600">Cargando matrícula...</div>;

    return (
        <div className="p-8 bg-gray-100 min-h-screen flex justify-center">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-4xl">
                <h2 className="text-2xl font-bold mb-6 text-center">Editar Matrícula</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Código *</label>
                        <input
                            type="text"
                            name="codigo"
                            value={form.codigo}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Descripción</label>
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* BUSCADOR ESTUDIANTE */}
                    <div className="md:col-span-1 relative">
                        <label className="block text-sm font-medium mb-1">Estudiante *</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Buscar por apellido o cédula"
                                value={busquedaEstudiante}
                                onChange={(e) => setBusquedaEstudiante(e.target.value)}
                                className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button
                                type="button"
                                onClick={buscarEstudiante}
                                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Buscar
                            </button>
                        </div>
                        {resultadoEstudiantes.length > 0 && (
                            <div className="absolute z-10 bg-white border rounded shadow max-h-40 overflow-y-auto w-full mt-1">
                                {resultadoEstudiantes.map(est => (
                                    <div
                                        key={est._id}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => seleccionarEstudiante(est)}
                                    >
                                        {est.nombre} {est.apellido} - {est.cedula}
                                    </div>
                                ))}
                            </div>
                        )}
                        {detalleEstudiante && (
                            <p className="mt-1 text-gray-700">{detalleEstudiante.nombre} {detalleEstudiante.apellido} - {detalleEstudiante.cedula}</p>
                        )}
                    </div>

                    {/* BUSCADOR MATERIA */}
                    <div className="md:col-span-1 relative">
                        <label className="block text-sm font-medium mb-1">Materia *</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Buscar por nombre o código"
                                value={busquedaMateria}
                                onChange={(e) => setBusquedaMateria(e.target.value)}
                                className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button
                                type="button"
                                onClick={buscarMateria}
                                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Buscar
                            </button>
                        </div>
                        {resultadoMaterias.length > 0 && (
                            <div className="absolute z-10 bg-white border rounded shadow max-h-40 overflow-y-auto w-full mt-1">
                                {resultadoMaterias.map(mat => (
                                    <div
                                        key={mat._id}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => seleccionarMateria(mat)}
                                    >
                                        {mat.nombre} - {mat.codigo}
                                    </div>
                                ))}
                            </div>
                        )}
                        {detalleMateria && (
                            <p className="mt-1 text-gray-700">{detalleMateria.nombre} - {detalleMateria.codigo}</p>
                        )}
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/matriculas")}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={updating || !form.estudiante || !form.materia}
                            className={`px-6 py-2 text-white rounded ${updating || !form.estudiante || !form.materia ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                        >
                            {updating ? "Actualizando..." : "Actualizar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EnrollmentEdit;  