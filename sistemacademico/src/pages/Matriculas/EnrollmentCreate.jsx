import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";

const EnrollmentCreate = () => {
    const navigate = useNavigate();
    const fetchData = useFetch();

    const initialState = { codigo: "", descripcion: "", estudiante: "", materia: "" };
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);

    const [estudiantes, setEstudiantes] = useState([]);
    const [busquedaEstudiante, setBusquedaEstudiante] = useState("");
    const [detalleEstudiante, setDetalleEstudiante] = useState(null);

    const [materias, setMaterias] = useState([]);
    const [busquedaMateria, setBusquedaMateria] = useState("");
    const [detalleMateria, setDetalleMateria] = useState(null);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const dataEst = await fetchData("/estudiantes/listar");
                if (dataEst?.estudiantes) setEstudiantes(dataEst.estudiantes);
                const dataMat = await fetchData("/materias/listar");
                if (dataMat?.materias) setMaterias(dataMat.materias);
            } catch {
                toast.error("Error al cargar datos iniciales");
            }
        };
        cargarDatos();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const buscarEstudiante = async () => {
        if (!busquedaEstudiante.trim()) return toast.error("Ingrese cédula o apellido");
        try {
            setDetalleEstudiante(null);
            const valor = busquedaEstudiante.trim();
            const esNumero = /^\d+$/.test(valor);
            const url = esNumero
                ? `/estudiantes/buscar?cedula=${valor}`
                : `/estudiantes/buscar?apellido=${valor}`;

            const data = await fetchData(url);
            if (!data?.estudiantes || data.estudiantes.length === 0) {
                toast.error("No se encontraron estudiantes");
                setEstudiantes([]);
                return;
            }

            setEstudiantes(data.estudiantes);
            if (data.estudiantes.length === 1) {
                setDetalleEstudiante(data.estudiantes[0]);
                setForm({ ...form, estudiante: data.estudiantes[0]._id });
                toast.success("Estudiante encontrado");
            } else {
                toast.success("Resultados encontrados");
            }
        } catch {
            toast.error("Error al buscar estudiante");
        }
    };

    const seleccionarEstudiante = (est) => {
        setDetalleEstudiante(est);
        setBusquedaEstudiante(est.cedula);
        setForm({ ...form, estudiante: est._id });
        toast.info("Estudiante seleccionado");
    };

    const buscarMateria = async () => {
        if (!busquedaMateria.trim()) return toast.error("Ingrese código o nombre");
        try {
            setDetalleMateria(null);
            const valor = busquedaMateria.trim();
            let data = await fetchData(`/materias/buscarMateria?codigo=${encodeURIComponent(valor)}`);
            if (!data?.materias || data.materias.length === 0) {
                data = await fetchData(`/materias/buscarMateria?nombre=${encodeURIComponent(valor)}`);
            }
            if (!data?.materias || data.materias.length === 0) {
                setMaterias([]);
                toast.error("No se encontraron materias");
                return;
            }

            setMaterias(data.materias);
            if (data.materias.length === 1) {
                setDetalleMateria(data.materias[0]);
                setForm({ ...form, materia: data.materias[0]._id });
                toast.success("Materia encontrada");
            } else {
                toast.success("Resultados encontrados");
            }
        } catch {
            toast.error("Error al buscar materia");
        }
    };

    const seleccionarMateria = (mat) => {
        setDetalleMateria(mat);
        setBusquedaMateria(mat.codigo);
        setForm({ ...form, materia: mat._id });
        toast.info("Materia seleccionada");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.codigo || !form.estudiante || !form.materia) return toast.error("Complete todos los campos obligatorios");

        try {
            setLoading(true);
            const res = await fetchData("/matriculas/crear", form, "POST");
            if (res?.error) return toast.error(res.error);

            toast.success(res?.msg || "Matrícula creada correctamente");
            setForm(initialState);
            setBusquedaEstudiante("");
            setDetalleEstudiante(null);
            setBusquedaMateria("");
            setDetalleMateria(null);
            navigate("/matriculas");
        } catch {
            toast.error("Error del servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-3 sm:p-4">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-5xl flex flex-col max-h-[550px] sm:max-h-[90vh] overflow-hidden">

                {/* Título */}
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 text-center sm:text-left">
                    Crear Nueva Matrícula
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto sm:overflow-hidden"
                >

                    {/* Código */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-1">
                            Código *
                        </label>
                        <input
                            type="text"
                            name="codigo"
                            value={form.codigo}
                            onChange={handleChange}
                            placeholder="Ej: MTR-001"
                            className="w-full border rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-blue-600 outline-none"
                        />
                    </div>

                    {/* Descripción */}
                    <div className="md:col-span-2">
                        <label className="block text-xs sm:text-sm font-medium mb-1">
                            Descripción
                        </label>
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            placeholder="Opcional"
                            className="w-full border rounded-lg px-3 sm:px-4 py-2 h-10 resize-none text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-blue-600 outline-none"
                        />
                    </div>

                    {/* Estudiante */}
                    <div className="md:col-span-1 flex flex-col">
                        <label className="block text-xs sm:text-sm font-medium mb-1">
                            Estudiante *
                        </label>

                        <div className="flex flex-col sm:flex-row gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="Cédula o apellido"
                                value={busquedaEstudiante}
                                onChange={(e) => setBusquedaEstudiante(e.target.value)}
                                className="flex-1 border rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-blue-600 outline-none"
                            />
                            <button
                                type="button"
                                onClick={buscarEstudiante}
                                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm md:text-base"
                            >
                                Buscar
                            </button>
                        </div>

                        <div className="overflow-y-auto border rounded-lg p-2 bg-gray-50 max-h-32 sm:max-h-40 text-xs sm:text-sm md:text-base">
                            {estudiantes.length === 0 ? (
                                <p>No hay estudiantes</p>
                            ) : (
                                estudiantes.map((est) => (
                                    <div
                                        key={est._id}
                                        className={`p-2 cursor-pointer hover:bg-gray-200 ${detalleEstudiante?._id === est._id
                                                ? "bg-blue-100"
                                                : ""
                                            }`}
                                        onClick={() => seleccionarEstudiante(est)}
                                    >
                                        {est.nombre} {est.apellido} - {est.cedula}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Materia */}
                    <div className="md:col-span-1 flex flex-col">
                        <label className="block text-xs sm:text-sm font-medium mb-1">
                            Materia *
                        </label>

                        <div className="flex flex-col sm:flex-row gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="Código o nombre"
                                value={busquedaMateria}
                                onChange={(e) => setBusquedaMateria(e.target.value)}
                                className="flex-1 border rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base focus:ring-2 focus:ring-blue-600 outline-none"
                            />
                            <button
                                type="button"
                                onClick={buscarMateria}
                                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm md:text-base"
                            >
                                Buscar
                            </button>
                        </div>

                        <div className="overflow-y-auto border rounded-lg p-2 bg-gray-50 max-h-32 sm:max-h-40 text-xs sm:text-sm md:text-base">
                            {materias.length === 0 ? (
                                <p>No hay materias</p>
                            ) : (
                                materias.map((mat) => (
                                    <div
                                        key={mat._id}
                                        className={`p-2 cursor-pointer hover:bg-gray-200 ${detalleMateria?._id === mat._id
                                                ? "bg-green-100"
                                                : ""
                                            }`}
                                        onClick={() => seleccionarMateria(mat)}
                                    >
                                        {mat.nombre} - {mat.codigo}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Botón */}
                    <div className="md:col-span-2 flex justify-center sm:justify-end mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full sm:w-auto px-6 py-2 rounded-lg text-white transition text-xs sm:text-sm md:text-base ${loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {loading ? "Guardando..." : "Crear Matrícula"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EnrollmentCreate;