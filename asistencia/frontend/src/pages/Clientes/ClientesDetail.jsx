import { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { toast } from "react-toastify";

const ClienteDetail = () => {
    const [clientes, setClientes] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [detalle, setDetalle] = useState(null);
    const fetchData = useFetch();

    // Cargar todos los clientes al iniciar
    useEffect(() => {
        const obtenerClientes = async () => {
            try {
                const data = await fetchData("/clientes/listar");
                if (data?.clientes) {
                    setClientes(data.clientes);
                } else {
                    setClientes([]);
                }
            } catch (error) {
                toast.error("Error al cargar clientes");
                setClientes([]);
            }
        };
        obtenerClientes();
    }, []);

    // Buscar SOLO por cédula
    const buscarCliente = async () => {
        if (!busqueda.trim()) {
            return toast.error("Ingrese cédula");
        }

        try {
            setDetalle(null);

            const data = await fetchData(
                `/clientes/buscar?cedula=${busqueda.trim()}`
            );

            if (!data || !data.cliente) {
                toast.error("Cliente no encontrado");
                setClientes([]);
                return;
            }

            // Si el backend devuelve un solo objeto
            setClientes([data.cliente]);
            setDetalle(data.cliente);
            toast.success("Cliente encontrado");
        } catch (error) {
            console.error(error);
            toast.error("Error al buscar cliente");
            setClientes([]);
        }
    };

    const resetClientes = async () => {
        setBusqueda("");
        setDetalle(null);
        try {
            const data = await fetchData("/clientes/listar");
            if (data?.clientes) {
                setClientes(data.clientes);
            } else {
                setClientes([]);
            }
        } catch {
            toast.error("Error al cargar clientes");
        }
    };

    const seleccionarCliente = (cl) => {
        setDetalle(cl);
        setBusqueda(cl.cedula);
        toast.info("Cliente seleccionado");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-4">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 w-full max-w-6xl">
                <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                    Clientes
                </h2>

                {/* BUSCADOR */}
                <div className="flex flex-col md:flex-row gap-2 mb-6">
                    <input
                        type="text"
                        placeholder="Ingrese cédula"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <button
                        onClick={buscarCliente}
                        className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition"
                    >
                        Buscar
                    </button>
                    <button
                        onClick={resetClientes}
                        className="bg-amber-400 text-white px-4 py-2 rounded-lg hover:bg-amber-500 transition"
                    >
                        Reset
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* LISTA */}
                    <div className="w-full md:w-1/2 bg-white/50 p-4 rounded-lg shadow-inner max-h-[400px] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-2">Resultados</h3>
                        {clientes.length === 0 ? (
                            <p>No hay clientes</p>
                        ) : (
                            clientes.map((cl) => (
                                <div
                                    key={cl._id}
                                    className="p-2 border-b border-gray-200 hover:bg-rose-100 cursor-pointer transition"
                                    onClick={() => seleccionarCliente(cl)}
                                >
                                    {cl.nombre} {cl.apellido} - {cl.cedula}
                                </div>
                            ))
                        )}
                    </div>

                    {/* DETALLE */}
                    <div className="w-full md:w-1/2 bg-white/50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">
                            Detalle del Cliente
                        </h3>
                        {detalle ? (
                            <div className="space-y-1 text-gray-700">
                                <p>
                                    <strong>Nombre:</strong> {detalle.nombre}{" "}
                                    {detalle.apellido}
                                </p>
                                <p>
                                    <strong>Cédula:</strong> {detalle.cedula}
                                </p>
                                <p>
                                    <strong>Fecha de Nacimiento:</strong>{" "}
                                    {detalle.fecha_nacimiento
                                        ? new Date(
                                              detalle.fecha_nacimiento
                                          ).toLocaleDateString()
                                        : "-"}
                                </p>
                                <p>
                                    <strong>Ciudad:</strong>{" "}
                                    {detalle.ciudad || "No registrado"}
                                </p>
                                <p>
                                    <strong>Dirección:</strong>{" "}
                                    {detalle.direccion || "No registrado"}
                                </p>
                                <p>
                                    <strong>Teléfono:</strong>{" "}
                                    {detalle.telefono || "No registrado"}
                                </p>
                                <p>
                                    <strong>Email:</strong>{" "}
                                    {detalle.email || "No registrado"}
                                </p>
                                <p>
                                    <strong>Dependencia:</strong>{" "}
                                    {detalle.dependencia || "No registrado"}
                                </p>
                            </div>
                        ) : (
                            <p>Seleccione un cliente de la lista</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClienteDetail;