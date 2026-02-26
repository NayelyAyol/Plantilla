import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";

const VehiculoDetail = () => {
    const fetchData = useFetch();

    const [vehiculos, setVehiculos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [detalle, setDetalle] = useState(null);
    const [loading, setLoading] = useState(false);

    // Cargar todos los vehículos al inicio
    useEffect(() => {
        const obtenerVehiculos = async () => {
            try {
                setLoading(true);
                const data = await fetchData("/vehiculos/listar");
                if (data?.vehiculos) setVehiculos(data.vehiculos);
            } catch (error) {
                toast.error("Error al cargar vehículos");
            } finally {
                setLoading(false);
            }
        };
        obtenerVehiculos();
    }, []);

    // Buscar por placa o marca
    const buscarVehiculo = async () => {
        if (!busqueda.trim()) {
            return toast.error("Ingrese placa o marca del vehículo");
        }

        try {
            setDetalle(null);
            setLoading(true);

            // Traer todos los vehículos
            const res = await fetchData("/vehiculos/listar");
            if (!res?.vehiculos || res.vehiculos.length === 0) {
                setVehiculos([]);
                toast.error("No se encontraron vehículos");
                return;
            }

            // Filtrar en frontend
            const texto = busqueda.trim().toLowerCase();
            const filtrados = res.vehiculos.filter(
                v =>
                    v.placa.toLowerCase().includes(texto) ||
                    v.marca.toLowerCase().includes(texto)
            );

            if (filtrados.length === 0) {
                setVehiculos([]);
                toast.error("No se encontró el vehículo");
                return;
            }

            setVehiculos(filtrados);

            if (filtrados.length === 1) {
                setDetalle(filtrados[0]);
                toast.success("Vehículo encontrado");
            } else {
                toast.success("Resultados encontrados");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al buscar vehículo");
        } finally {
            setLoading(false);
        }
    };

    const resetBusqueda = async () => {
        setBusqueda("");
        setDetalle(null);
        try {
            setLoading(true);
            const data = await fetchData("/vehiculos/listar");
            if (data?.vehiculos) setVehiculos(data.vehiculos);
        } catch {
            toast.error("Error al cargar vehículos");
        } finally {
            setLoading(false);
        }
    };

    const seleccionarVehiculo = (veh) => {
        setDetalle(veh);
        setBusqueda(veh.placa);
        toast.info("Vehículo seleccionado");
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-4">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 w-full max-w-6xl">

                {/* Título */}
                <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                    Vehículos
                </h2>

                {/* Buscador por placa o marca */}
                <div className="flex flex-col md:flex-row gap-2 mb-6">
                    <input
                        type="text"
                        placeholder="Buscar por placa o marca"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <button
                        onClick={buscarVehiculo}
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
                            <p className="text-center py-4">Cargando vehículos...</p>
                        ) : vehiculos.length === 0 ? (
                            <p>No hay vehículos</p>
                        ) : (
                            vehiculos.map((veh) => (
                                <div
                                    key={veh._id}
                                    className={`p-2 border-b border-gray-200 hover:bg-rose-100 cursor-pointer transition ${detalle?._id === veh._id ? "bg-blue-100" : ""}`}
                                    onClick={() => seleccionarVehiculo(veh)}
                                >
                                    <strong>{veh.placa}</strong> - {veh.marca} - {veh.modelo} - {veh.color}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Detalle del vehículo */}
                    <div className="w-full md:w-1/2 bg-white/50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Detalle del Vehículo</h3>
                        {detalle ? (
                            <div className="space-y-1 text-gray-700">
                                <p><strong>Marca:</strong> {detalle.marca}</p>
                                <p><strong>Modelo:</strong> {detalle.modelo}</p>
                                <p><strong>Año de Fabricación:</strong> {detalle.anio_fabricacion}</p>
                                <p><strong>Placa:</strong> {detalle.placa}</p>
                                <p><strong>Color:</strong> {detalle.color}</p>
                                <p><strong>Tipo de Vehículo:</strong> {detalle.tipo_vehiculo}</p>
                                <p><strong>Kilometraje:</strong> {detalle.kilometraje}</p>
                                <p><strong>Descripción:</strong> {detalle.descripcion}</p>
                            </div>
                        ) : (
                            <p>Seleccione un vehículo de la lista</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default VehiculoDetail;