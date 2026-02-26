import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";

const TicketEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fetchData = useFetch();

    const [form, setForm] = useState({ codigo: "", descripcion: "", cliente: "", tecnico: "" });
    const [loading, setLoading] = useState(false);

    // Estados para Clientes
    const [clientes, setClientes] = useState([]);
    const [busquedaCliente, setBusquedaCliente] = useState("");
    const [detalleCliente, setDetalleCliente] = useState(null);

    // Estados para Técnicos
    const [tecnicos, setTecnicos] = useState([]);
    const [busquedaTecnico, setBusquedaTecnico] = useState("");
    const [detalleTecnico, setDetalleTecnico] = useState(null);

    // ================================
    // CARGAR DATOS INICIALES
    // ================================
    useEffect(() => {
        const cargarTodo = async () => {
            try {
                const [resClientes, resTecnicos, resTicket] = await Promise.all([
                    fetchData("/clientes/listar"),
                    fetchData("/tecnicos/listar"),
                    fetchData(`/tickets/buscarid/${id}`)
                ]);

                if (resClientes?.clientes) setClientes(resClientes.clientes);
                if (resTecnicos?.tecnicos) setTecnicos(resTecnicos.tecnicos);

                if (resTicket?.ticket) {
                    const ticket = resTicket.ticket;
                    setForm({
                        codigo: ticket.codigo,
                        descripcion: ticket.descripcion || "",
                        cliente: ticket.cliente?._id,
                        tecnico: ticket.tecnico?._id
                    });

                    setDetalleCliente(ticket.cliente);
                    setBusquedaCliente(ticket.cliente?.cedula || "");

                    setDetalleTecnico(ticket.tecnico);
                    setBusquedaTecnico(ticket.tecnico?.cedula || "");
                }
            } catch (error) {
                toast.error("Error al cargar datos del servidor");
            }
        };
        cargarTodo();
    }, [id]);

    // ================================
    // LÓGICA CLIENTES
    // ================================
    const buscarCliente = async () => {
        if (!busquedaCliente.trim()) return;
        try {
            const valor = busquedaCliente.trim();
            const url = /^\d+$/.test(valor)
                ? `/clientes/buscar?cedula=${valor}`
                : `/clientes/buscar?apellido=${valor}`;
            const data = await fetchData(url);
            if (data?.clientes) setClientes(data.clientes);
        } catch {
            toast.error("Cliente no encontrado");
        }
    };

    const resetCliente = async () => {
        setBusquedaCliente("");
        const data = await fetchData("/clientes/listar");
        if (data?.clientes) setClientes(data.clientes);
    };

    const seleccionarCliente = (c) => {
        setDetalleCliente(c);
        setBusquedaCliente(c.cedula);
        setForm({ ...form, cliente: c._id });
        toast.info("Cliente seleccionado");
    };

    // ================================
    // LÓGICA TÉCNICOS
    // ================================
    const buscarTecnico = async () => {
        if (!busquedaTecnico.trim()) return;
        try {
            const valor = busquedaTecnico.trim();
            const url = /^\d+$/.test(valor)
                ? `/tecnicos/buscar?cedula=${valor}`
                : `/tecnicos/buscar?apellido=${valor}`;
            const data = await fetchData(url);
            if (data?.tecnicos) setTecnicos(data.tecnicos);
        } catch {
            toast.error("Técnico no encontrado");
        }
    };

    const resetTecnico = async () => {
        setBusquedaTecnico("");
        const data = await fetchData("/tecnicos/listar");
        if (data?.tecnicos) setTecnicos(data.tecnicos);
    };

    const seleccionarTecnico = (t) => {
        setDetalleTecnico(t);
        setBusquedaTecnico(t.cedula);
        setForm({ ...form, tecnico: t._id });
        toast.info("Técnico seleccionado");
    };

    // ================================
    // GUARDAR CAMBIOS
    // ================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await fetchData(`/tickets/actualizar/${id}`, form, "PUT");
            toast.success(res?.msg || "Ticket actualizado correctamente");
            navigate("/tickets/listar");
        } catch (err) {
            toast.error(err.response?.data?.msg || "Error al actualizar ticket");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-6 bg-[#FFF5F3]">
            <form className="bg-white p-8 rounded-3xl shadow-xl border border-[#FFE5E1] max-w-5xl mx-auto mt-8"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-[#FF6F61] to-[#E85A4F] bg-clip-text text-transparent text-center">
                    Panel de Edición: Ticket {form.codigo}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Código de Ticket *"
                            name="codigo"
                            value={form.codigo}
                            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                        />

                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1 text-[#E85A4F]">Descripción</label>
                            <textarea
                                value={form.descripcion}
                                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                                className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF8A75] outline-none resize-none"
                                rows="1"
                            />
                        </div>
                    </div>

                    {/* CLIENTES */}
                    <SelectorLista
                        label="Seleccionar Cliente *"
                        busqueda={busquedaCliente}
                        setBusqueda={setBusquedaCliente}
                        lista={clientes}
                        detalleSeleccionado={detalleCliente}
                        onBuscar={buscarCliente}
                        onReset={resetCliente}
                        onSeleccionar={seleccionarCliente}
                        placeholder="Cédula o Apellido"
                        mostrar={(c) => `${c.cedula} - ${c.nombre} ${c.apellido}`}
                    />

                    {/* TÉCNICOS */}
                    <SelectorLista
                        label="Seleccionar Técnico *"
                        busqueda={busquedaTecnico}
                        setBusqueda={setBusquedaTecnico}
                        lista={tecnicos}
                        detalleSeleccionado={detalleTecnico}
                        onBuscar={buscarTecnico}
                        onReset={resetTecnico}
                        onSeleccionar={seleccionarTecnico}
                        placeholder="Cédula o Apellido"
                        mostrar={(t) => `${t.cedula} - ${t.nombre} ${t.apellido}`}
                    />
                </div>

                <div className="flex gap-4 mt-10">
                    <button
                        type="button"
                        onClick={() => navigate("/tickets/listar")}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-[2] bg-gradient-to-r from-[#FF6F61] to-[#E85A4F] text-white py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity"
                    >
                        {loading ? "Sincronizando..." : "Confirmar Edición"}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Componente Input simple
const Input = ({ label, ...props }) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-[#E85A4F]">{label}</label>
        <input
            {...props}
            className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF8A75] outline-none transition"
        />
    </div>
);

// Componente genérico para listas de selección (Clientes o Técnicos)
const SelectorLista = ({ label, busqueda, setBusqueda, lista, detalleSeleccionado, onBuscar, onReset, onSeleccionar, placeholder, mostrar }) => (
    <div className="space-y-4">
        <label className="block text-sm font-bold text-[#E85A4F]">{label}</label>
        <div className="flex gap-2">
            <input
                type="text"
                placeholder={placeholder}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-[#FF8A75]"
            />
            <button type="button" onClick={onBuscar}
                className="bg-[#FF6F61] text-white px-3 py-2 rounded-xl text-sm hover:bg-[#E85A4F]">
                Buscar
            </button>
            <button type="button" onClick={onReset}
                className="bg-gray-400 text-white px-3 py-2 rounded-xl text-sm hover:bg-gray-500">
                Reset
            </button>
        </div>

        <div className="overflow-y-auto border rounded-2xl p-2 bg-[#FFF5F3] max-h-48 border-[#FFE5E1]">
            {lista.map(item => (
                <div
                    key={item._id}
                    onClick={() => onSeleccionar(item)}
                    className={`p-3 cursor-pointer rounded-xl mb-1 text-sm transition-all ${
                        detalleSeleccionado?._id === item._id
                            ? "bg-[#FF6F61] text-white shadow-md"
                            : "hover:bg-[#FFE5E1] text-gray-700"
                    }`}
                >
                    {mostrar(item)}
                </div>
            ))}
        </div>
    </div>
);

export default TicketEdit;