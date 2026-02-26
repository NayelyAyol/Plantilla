import { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { toast } from "react-toastify";

const StudentDetail = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [detalle, setDetalle] = useState(null);
    const fetchData = useFetch();

    useEffect(() => {
        const obtenerEstudiantes = async () => {
            try {
                const data = await fetchData("/estudiantes/listar");
                if (data?.estudiantes) {
                    setEstudiantes(data.estudiantes);
                }
            } catch (error) {
                toast.error("Error al cargar estudiantes");
            }
        };
        obtenerEstudiantes();
    }, []);

    const buscarEstudiante = async () => {
        if (!busqueda.trim()) {
            return toast.error("Ingrese una cédula o apellido");
        }

        try {
            setDetalle(null);

            const valor = busqueda.trim();
            const esNumero = /^\d+$/.test(valor);

            const url = esNumero
                ? `/estudiantes/buscar?cedula=${valor}`
                : `/estudiantes/buscar?apellido=${valor}`;

            const data = await fetchData(url);

            if (!data || !data.estudiantes || data.estudiantes.length === 0) {
                toast.error("No se encontraron estudiantes");
                return;
            }

            setEstudiantes(data.estudiantes);

            if (data.estudiantes.length === 1) {
                setDetalle(data.estudiantes[0]);
                toast.success("Estudiante encontrado");
            } else {
                toast.success("Resultados encontrados");
            }

        } catch (error) {
            console.error(error);
            toast.error("Error al buscar estudiante");
        }
    };

    const seleccionarEstudiante = (est) => {
        setDetalle(est);
        setBusqueda(est.cedula);
        toast.info("Estudiante seleccionado");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            {/* CUADRO BLANCO PRINCIPAL */}
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-5xl">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Estudiantes
                </h2>

                {/* BUSCADOR */}
                <div className="flex gap-2 mb-6">
                    <input
                        type="text"
                        placeholder="Ingrese cédula o apellido"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={buscarEstudiante}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Buscar
                    </button>
                </div>

                <div className="flex gap-6">
                    {/* LISTA DE RESULTADOS CON SCROLL */}
                    <div className="w-1/2 bg-gray-50 p-4 rounded-lg shadow-inner max-h-[400px] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-2">
                            Resultados
                        </h3>
                        {estudiantes.length === 0 ? (
                            <p>No hay estudiantes</p>
                        ) : (
                            estudiantes.map((est) => (
                                <div
                                    key={est._id}
                                    className="p-2 border-b border-gray-200 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => seleccionarEstudiante(est)}
                                >
                                    {est.nombre} {est.apellido} - {est.cedula}
                                </div>
                            ))
                        )}
                    </div>

                    {/* DETALLE */}
                    <div className="w-1/2 bg-gray-100 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">
                            Detalle del Estudiante
                        </h3>
                        {detalle ? (
                            <div>
                                <p><strong>Nombre:</strong> {detalle.nombre} {detalle.apellido}</p>
                                <p><strong>Cédula:</strong> {detalle.cedula}</p>
                                <p><strong>Fecha de Nacimiento:</strong> {new Date(detalle.fecha_nacimiento).toLocaleDateString()}</p>
                                <p><strong>Ciudad:</strong> {detalle.ciudad || "No registrado"}</p>
                                <p><strong>Dirección:</strong> {detalle.direccion}</p>
                                <p><strong>Teléfono:</strong> {detalle.telefono || "No registrado"}</p>
                                <p><strong>Email:</strong> {detalle.email}</p>
                            </div>
                        ) : (
                            <p>Seleccione un estudiante de la lista</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetail;