import { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { toast } from "react-toastify";

const SubjectDetail = () => {
    const [materias, setMaterias] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [detalle, setDetalle] = useState(null);
    const fetchData = useFetch();

    useEffect(() => {
        const obtenerMaterias = async () => {
            try {
                const data = await fetchData("/materias/listar");
                if (data?.materias) {
                    setMaterias(data.materias);
                }
            } catch (error) {
                toast.error("Error al cargar materias");
            }
        };
        obtenerMaterias();
    }, []);

    const buscarMateria = async () => {
        if (!busqueda.trim()) {
            return toast.error("Ingrese código o nombre");
        }

        try {
            setDetalle(null);

            const valor = busqueda.trim();

            // Hacemos dos llamadas para buscar por código o nombre
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
                setDetalle(data.materias[0]);
                toast.success("Materia encontrada");
            } else {
                toast.success("Resultados encontrados");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al buscar materia");
        }
    };

    const seleccionarMateria = (mat) => {
        setDetalle(mat);
        setBusqueda(mat.codigo);
        toast.info("Materia seleccionada");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-5xl">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Materias
                </h2>

                {/* BUSCADOR */}
                <div className="flex gap-2 mb-6">
                    <input
                        type="text"
                        placeholder="Ingrese código o nombre"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={buscarMateria}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Buscar
                    </button>
                </div>

                <div className="flex gap-6">
                    {/* LISTA DE RESULTADOS CON SCROLL */}
                    <div className="w-1/2 bg-gray-50 p-4 rounded-lg shadow-inner max-h-[400px] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-2">Resultados</h3>
                        {materias.length === 0 ? (
                            <p>No hay materias</p>
                        ) : (
                            materias.map((mat) => (
                                <div
                                    key={mat._id}
                                    className="p-2 border-b border-gray-200 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => seleccionarMateria(mat)}
                                >
                                    {mat.nombre} - {mat.codigo}
                                </div>
                            ))
                        )}
                    </div>

                    {/* DETALLE */}
                    <div className="w-1/2 bg-gray-100 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">
                            Detalle de la Materia
                        </h3>
                        {detalle ? (
                            <div>
                                <p><strong>Nombre:</strong> {detalle.nombre}</p>
                                <p><strong>Código:</strong> {detalle.codigo}</p>
                                <p><strong>Descripción:</strong> {detalle.descripcion}</p>
                                <p><strong>Créditos:</strong> {detalle.creditos}</p>
                            </div>
                        ) : (
                            <p>Seleccione una materia de la lista</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubjectDetail;