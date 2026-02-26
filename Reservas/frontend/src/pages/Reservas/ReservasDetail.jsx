import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";

const ReservaDetail = () => {
    const fetchData = useFetch();

    const [reservas, setReservas] = useState([]);
    const [codigo, setCodigo] = useState("");
    const [detalle, setDetalle] = useState(null);
    const [loading, setLoading] = useState(false);

    // Cargar todas las reservas al inicio
    useEffect(() => {
        const obtenerReservas = async () => {
            try {
                setLoading(true);
                const data = await fetchData("/reservas/listar");
                if (data?.length) setReservas(data);
            } catch (error) {
                toast.error("Error al cargar reservas");
            } finally {
                setLoading(false);
            }
        };
        obtenerReservas();
    }, []);

    const buscarReserva = async () => {
        if (!codigo.trim()) {
            return toast.error("Ingrese el código de la reserva");
        }

        try {
            setDetalle(null);
            setLoading(true);

            const query = new URLSearchParams({ codigo: codigo.trim() }).toString();
            const res = await fetchData(`/reservas/buscar?${query}`);

            if (!res?.reservas || res.reservas.length === 0) {
                setReservas([]);
                toast.error("No se encontró la reserva");
                return;
            }

            setReservas(res.reservas);

            if (res.reservas.length === 1) {
                setDetalle(res.reservas[0]);
                toast.success("Reserva encontrada");
            } else {
                toast.success("Resultados encontrados");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al buscar reserva");
        } finally {
            setLoading(false);
        }
    };

    const resetReservas = async () => {
        setCodigo("");
        setDetalle(null);
        try {
            setLoading(true);
            const data = await fetchData("/reservas/listar");
            if (data?.length) setReservas(data);
        } catch {
            toast.error("Error al cargar reservas");
        } finally {
            setLoading(false);
        }
    };

    const seleccionarReserva = (res) => {
        setDetalle(res);
        setCodigo(res.codigo);
        toast.info("Reserva seleccionada");
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-4">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 w-full max-w-6xl">

                {/* Título */}
                <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                    Reservas
                </h2>

                {/* Buscador solo por código */}
                <div className="flex flex-col md:flex-row gap-2 mb-6">
                    <input
                        type="text"
                        placeholder="Código de la reserva"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <button
                        onClick={buscarReserva}
                        className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition"
                    >
                        Buscar
                    </button>
                    <button
                        onClick={resetReservas}
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
                            <p className="text-center py-4">Cargando reservas...</p>
                        ) : reservas.length === 0 ? (
                            <p>No hay reservas</p>
                        ) : (
                            reservas.map((res) => (
                                <div
                                    key={res._id}
                                    className={`p-2 border-b border-gray-200 hover:bg-rose-100 cursor-pointer transition ${detalle?._id === res._id ? "bg-blue-100" : ""}`}
                                    onClick={() => seleccionarReserva(res)}
                                >
                                    <strong>{res.codigo}</strong> - {res.cliente?.nombre} {res.cliente?.apellido} - {res.vehiculo?.marca} {res.vehiculo?.modelo}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Detalle de reserva */}
                    <div className="w-full md:w-1/2 bg-white/50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Detalle de la Reserva</h3>
                        {detalle ? (
                            <div className="space-y-1 text-gray-700">
                                <p><strong>Código:</strong> {detalle.codigo}</p>
                                {detalle.descripcion && <p><strong>Descripción:</strong> {detalle.descripcion}</p>}
                                <p><strong>Cliente:</strong> {detalle.cliente?.nombre} {detalle.cliente?.apellido}</p>
                                <p><strong>Cédula:</strong> {detalle.cliente?.cedula}</p>
                                <p><strong>Vehículo:</strong> {detalle.vehiculo?.marca} {detalle.vehiculo?.modelo}</p>
                                <p><strong>Placa:</strong> {detalle.vehiculo?.placa}</p>
                            </div>
                        ) : (
                            <p>Seleccione una reserva de la lista</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservaDetail;