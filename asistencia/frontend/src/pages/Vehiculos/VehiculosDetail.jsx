import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";

const TecnicoDetail = () => {
    const fetchData = useFetch();

    const [tecnicos, setTecnicos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [detalle, setDetalle] = useState(null);
    const [loading, setLoading] = useState(false);

    // Cargar todos los técnicos al inicio
    useEffect(() => {
        const obtenerTecnicos = async () => {
            try {
                setLoading(true);
                const data = await fetchData("/tecnicos/listar");
                if (data?.tecnicos) setTecnicos(data.tecnicos);
            } catch (error) {
                toast.error("Error al cargar técnicos");
            } finally {
                setLoading(false);
            }
        };
        obtenerTecnicos();
    }, []);

    // Buscar por cédula o nombre
    const buscarTecnico = async () => {
        if (!busqueda.trim()) {
            return toast.error("Ingrese cédula o nombre del técnico");
        }

        try {
            setDetalle(null);
            setLoading(true);

            const res = await fetchData("/tecnicos/listar");
            if (!res?.tecnicos || res.tecnicos.length === 0) {
                setTecnicos([]);
                toast.error("No se encontraron técnicos");
                return;
            }

            const texto = busqueda.trim().toLowerCase();
            const filtrados = res.tecnicos.filter(
                t =>
                    t.cedula.includes(texto) ||
                    t.nombre.toLowerCase().includes(texto) ||
                    t.apellido.toLowerCase().includes(texto)
            );

            if (filtrados.length === 0) {
                setTecnicos([]);
                toast.error("No se encontró el técnico");
                return;
            }

            setTecnicos(filtrados);

            if (filtrados.length === 1) {
                setDetalle(filtrados[0]);
                toast.success("Técnico encontrado");
            } else {
                toast.success("Resultados encontrados");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al buscar técnico");
        } finally {
            setLoading(false);
        }
    };

    const resetBusqueda = async () => {
        setBusqueda("");
        setDetalle(null);
        try {
            setLoading(true);
            const data = await fetchData("/tecnicos/listar");
            if (data?.tecnicos) setTecnicos(data.tecnicos);
        } catch {
            toast.error("Error al cargar técnicos");
        } finally {
            setLoading(false);
        }
    };

    const seleccionarTecnico = (tec) => {
        setDetalle(tec);
        setBusqueda(tec.cedula);
        toast.info("Técnico seleccionado");
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-4">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 w-full max-w-6xl">

                {/* Título */}
                <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                    Técnicos
                </h2>

                {/* Buscador por cédula o nombre */}
                <div className="flex flex-col md:flex-row gap-2 mb-6">
                    <input
                        type="text"
                        placeholder="Buscar por cédula o nombre"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <button
                        onClick={buscarTecnico}
                        className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition"
                    >
                        Buscar
                    </button>
                    <button
                        onClick={resetBusqueda}
                        className="bg-amber-400 text-white px-4 py-2 rounded-lg hover:bg-amber-500 transition"
                    >
                        Reset
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">

                    {/* Lista de resultados */}
                    <div className="w-full md:w-1/2 bg-white/50 p-4 rounded-lg shadow-inner max-h-[400px] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-2">Resultados</h3>
                        {loading ? (
                            <p className="text-center py-4">Cargando técnicos...</p>
                        ) : tecnicos.length === 0 ? (
                            <p>No hay técnicos</p>
                        ) : (
                            tecnicos.map((tec) => (
                                <div
                                    key={tec._id}
                                    className={`p-2 border-b border-gray-200 hover:bg-rose-100 cursor-pointer transition ${detalle?._id === tec._id ? "bg-blue-100" : ""}`}
                                    onClick={() => seleccionarTecnico(tec)}
                                >
                                    <strong>{tec.cedula}</strong> - {tec.nombre} {tec.apellido}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Detalle del técnico */}
                    <div className="w-full md:w-1/2 bg-white/50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Detalle del Técnico</h3>
                        {detalle ? (
                            <div className="space-y-1 text-gray-700">
                                <p><strong>Nombre:</strong> {detalle.nombre} {detalle.apellido}</p>
                                <p><strong>Cédula:</strong> {detalle.cedula}</p>
                                <p><strong>Fecha de Nacimiento:</strong> {new Date(detalle.fecha_nacimiento).toLocaleDateString()}</p>
                                <p><strong>Género:</strong> {detalle.genero}</p>
                                <p><strong>Ciudad:</strong> {detalle.ciudad}</p>
                                <p><strong>Dirección:</strong> {detalle.direccion}</p>
                                <p><strong>Teléfono:</strong> {detalle.telefono}</p>
                                <p><strong>Email:</strong> {detalle.email}</p>
                            </div>
                        ) : (
                            <p>Seleccione un técnico de la lista</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TecnicoDetail;