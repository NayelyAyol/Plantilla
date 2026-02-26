import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";

const TicketDetail = () => {
    const fetchData = useFetch();

    const [tickets, setTickets] = useState([]);
    const [codigo, setCodigo] = useState("");
    const [detalle, setDetalle] = useState(null);
    const [loading, setLoading] = useState(false);

    // Cargar todos los tickets al inicio
    useEffect(() => {
        const obtenerTickets = async () => {
            try {
                setLoading(true);
                const data = await fetchData("/tickets/listar");
                if (data?.length) setTickets(data);
            } catch (error) {
                toast.error("Error al cargar tickets");
            } finally {
                setLoading(false);
            }
        };
        obtenerTickets();
    }, []);

    const buscarTicket = async () => {
        if (!codigo.trim()) {
            return toast.error("Ingrese el código del ticket");
        }

        try {
            setDetalle(null);
            setLoading(true);

            const query = new URLSearchParams({ codigo: codigo.trim() }).toString();
            const res = await fetchData(`/tickets/buscar?${query}`);

            if (!res?.ticket) {
                setTickets([]);
                toast.error("No se encontró el ticket");
                return;
            }

            // Como buscarTicket devuelve un solo ticket
            setTickets([res.ticket]);
            setDetalle(res.ticket);
            toast.success("Ticket encontrado");
        } catch (error) {
            console.error(error);
            toast.error("Error al buscar ticket");
        } finally {
            setLoading(false);
        }
    };

    const resetTickets = async () => {
        setCodigo("");
        setDetalle(null);
        try {
            setLoading(true);
            const data = await fetchData("/tickets/listar");
            if (data?.length) setTickets(data);
        } catch {
            toast.error("Error al cargar tickets");
        } finally {
            setLoading(false);
        }
    };

    const seleccionarTicket = (ticket) => {
        setDetalle(ticket);
        setCodigo(ticket.codigo);
        toast.info("Ticket seleccionado");
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-4">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 w-full max-w-6xl">

                {/* Título */}
                <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                    Tickets
                </h2>

                {/* Buscador solo por código */}
                <div className="flex flex-col md:flex-row gap-2 mb-6">
                    <input
                        type="text"
                        placeholder="Código del ticket"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <button
                        onClick={buscarTicket}
                        className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition"
                    >
                        Buscar
                    </button>
                    <button
                        onClick={resetTickets}
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
                            <p className="text-center py-4">Cargando tickets...</p>
                        ) : tickets.length === 0 ? (
                            <p>No hay tickets</p>
                        ) : (
                            tickets.map((t) => (
                                <div
                                    key={t._id}
                                    className={`p-2 border-b border-gray-200 hover:bg-rose-100 cursor-pointer transition ${detalle?._id === t._id ? "bg-blue-100" : ""}`}
                                    onClick={() => seleccionarTicket(t)}
                                >
                                    <strong>{t.codigo}</strong> - {t.cliente?.nombre} {t.cliente?.apellido} - {t.tecnico?.nombre} {t.tecnico?.apellido}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Detalle del ticket */}
                    <div className="w-full md:w-1/2 bg-white/50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Detalle del Ticket</h3>
                        {detalle ? (
                            <div className="space-y-1 text-gray-700">
                                <p><strong>Código:</strong> {detalle.codigo}</p>
                                {detalle.descripcion && <p><strong>Descripción:</strong> {detalle.descripcion}</p>}
                                <p><strong>Cliente:</strong> {detalle.cliente?.nombre} {detalle.cliente?.apellido}</p>
                                <p><strong>Cédula Cliente:</strong> {detalle.cliente?.cedula}</p>
                                <p><strong>Técnico:</strong> {detalle.tecnico?.nombre} {detalle.tecnico?.apellido}</p>
                                <p><strong>Cédula Técnico:</strong> {detalle.tecnico?.cedula}</p>
                            </div>
                        ) : (
                            <p>Seleccione un ticket de la lista</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetail;