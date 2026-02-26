import { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { toast } from "react-toastify";

const EnrollmentDetail = () => {
    const [matriculas, setMatriculas] = useState([]);
    const [busqueda, setBusqueda] = useState({
        codigo: "",
        estudiante: "",
        materia: ""
    });
    const [detalle, setDetalle] = useState(null);
    const fetchData = useFetch();

    useEffect(() => {
        const obtenerTodas = async () => {
            try {
                const data = await fetchData("/matriculas/listar");
                if (data) setMatriculas(data);
            } catch (error) {
                toast.error("Error al cargar matrículas");
            }
        };
        obtenerTodas();
    }, []);

    const buscarMatricula = async () => {
        const { codigo, estudiante, materia } = busqueda;
        if (!codigo.trim() && !estudiante.trim() && !materia.trim()) {
            return toast.error("Ingrese al menos un criterio de búsqueda");
        }

        try {
            setDetalle(null);

            const query = new URLSearchParams({
                codigo: codigo.trim(),
                estudiante: estudiante.trim(),
                materia: materia.trim()
            }).toString();

            const res = await fetchData(`/matriculas/buscarMatricula?${query}`);

            if (!res?.matriculas || res.matriculas.length === 0) {
                setMatriculas([]);
                toast.error("No se encontraron matrículas");
                return;
            }

            setMatriculas(res.matriculas);

            if (res.matriculas.length === 1) {
                setDetalle(res.matriculas[0]);
                toast.success("Matrícula encontrada");
            } else {
                toast.success("Resultados encontrados");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al buscar matrícula");
        }
    };

    const seleccionarMatricula = (mat) => {
        setDetalle(mat);
        setBusqueda({
            codigo: mat.codigo,
            estudiante: `${mat.estudiante?.nombre} ${mat.estudiante?.apellido}`,
            materia: mat.materia?.nombre
        });
        toast.info("Matrícula seleccionada");
    };

    return (
        <div className="bg-gray-100 min-h-screen flex justify-center items-start p-4 md:p-8">

            {/* CONTENEDOR PRINCIPAL */}
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-7xl flex flex-col min-h-[80vh]">

                {/* HEADER */}
                <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Matrículas
                    </h2>
                </div>

                {/* BUSCADOR */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Código"
                        value={busqueda.codigo}
                        onChange={(e) =>
                            setBusqueda({ ...busqueda, codigo: e.target.value })
                        }
                        className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    <input
                        type="text"
                        placeholder="Estudiante"
                        value={busqueda.estudiante}
                        onChange={(e) =>
                            setBusqueda({ ...busqueda, estudiante: e.target.value })
                        }
                        className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    <input
                        type="text"
                        placeholder="Materia"
                        value={busqueda.materia}
                        onChange={(e) =>
                            setBusqueda({ ...busqueda, materia: e.target.value })
                        }
                        className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    <button
                        onClick={buscarMatricula}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Buscar
                    </button>
                </div>

                {/* CONTENIDO PRINCIPAL */}
                <div className="flex flex-col lg:flex-row gap-6 flex-1">

                    {/* LISTA */}
                    <div className="w-full lg:w-1/2 border rounded-lg flex flex-col">

                        <div className="bg-gray-100 px-4 py-2 font-semibold border-b">
                            Resultados
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {matriculas.length === 0 ? (
                                <p className="p-4 text-gray-500">
                                    No hay matrículas
                                </p>
                            ) : (
                                matriculas.map((mat) => (
                                    <div
                                        key={mat._id}
                                        className="p-3 border-b hover:bg-gray-50 cursor-pointer text-sm md:text-base"
                                        onClick={() => seleccionarMatricula(mat)}
                                    >
                                        {mat.codigo} - {mat.estudiante?.nombre}{" "}
                                        {mat.estudiante?.apellido} -{" "}
                                        {mat.materia?.nombre}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* DETALLE */}
                    <div className="w-full lg:w-1/2 border rounded-lg flex flex-col">

                        <div className="bg-gray-100 px-4 py-2 font-semibold border-b">
                            Detalle de la Matrícula
                        </div>

                        <div className="p-4 flex-1 overflow-y-auto">
                            {detalle ? (
                                <div className="space-y-3 text-sm md:text-base">
                                    <p><strong>Código:</strong> {detalle.codigo}</p>
                                    <p><strong>Descripción:</strong> {detalle.descripcion || "Sin descripción"}</p>
                                    <p>
                                        <strong>Estudiante:</strong>{" "}
                                        {detalle.estudiante?.nombre}{" "}
                                        {detalle.estudiante?.apellido} (
                                        {detalle.estudiante?.cedula})
                                    </p>
                                    <p>
                                        <strong>Materia:</strong>{" "}
                                        {detalle.materia?.nombre} (
                                        {detalle.materia?.codigo})
                                    </p>
                                    <p>
                                        <strong>Créditos:</strong>{" "}
                                        {detalle.materia?.creditos}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-gray-500">
                                    Seleccione una matrícula
                                </p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EnrollmentDetail;