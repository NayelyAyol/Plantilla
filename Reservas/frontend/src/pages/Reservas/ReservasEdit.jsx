import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";

const ReservaEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fetchData = useFetch();

    const [form, setForm] = useState({ codigo: "", descripcion: "", cliente: "", vehiculo: "" });
    const [loading, setLoading] = useState(false);

    // Estados para Clientes (Igual a ReservaCreate)
    const [clientes, setClientes] = useState([]);
    const [busquedaCliente, setBusquedaCliente] = useState("");
    const [detalleCliente, setDetalleCliente] = useState(null);

    // Estados para Vehículos (Igual a ReservaCreate)
    const [vehiculos, setVehiculos] = useState([]);
    const [busquedaVehiculo, setBusquedaVehiculo] = useState("");
    const [detalleVehiculo, setDetalleVehiculo] = useState(null);

    // 1. CARGAR DATOS INICIALES
    useEffect(() => {
        const cargarTodo = async () => {
            try {
                const [resClientes, resVehiculos, resReservas] = await Promise.all([
                    fetchData("/clientes/listar"),
                    fetchData("/vehiculos/listar"),
                    fetchData("/reservas/listar")
                ]);

                if (resClientes?.clientes) setClientes(resClientes.clientes);
                if (resVehiculos?.vehiculos) setVehiculos(resVehiculos.vehiculos);

                const reservaActual = resReservas.find(r => r._id === id);
                if (reservaActual) {
                    setForm({
                        codigo: reservaActual.codigo,
                        descripcion: reservaActual.descripcion || "",
                        cliente: reservaActual.cliente?._id,
                        vehiculo: reservaActual.vehiculo?._id
                    });

                    setDetalleCliente(reservaActual.cliente);
                    setBusquedaCliente(reservaActual.cliente?.cedula || "");
                    setDetalleVehiculo(reservaActual.vehiculo);
                    setBusquedaVehiculo(reservaActual.vehiculo?.placa || "");
                }
            } catch (error) {
                toast.error("Error al sincronizar con el servidor");
            }
        };
        cargarTodo();
    }, [id]);

    // ================================
    // Lógica Clientes
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
    // Lógica Vehículos
    // ================================
    const buscarVehiculo = async () => {
        if (!busquedaVehiculo.trim()) return;
        try {
            const valor = busquedaVehiculo.trim();
            let data = await fetchData(`/vehiculos/buscar?placa=${valor}`);
            if (!data?.vehiculos?.length)
                data = await fetchData(`/vehiculos/buscar?modelo=${valor}`);
            if (data?.vehiculos) setVehiculos(data.vehiculos);
        } catch {
            toast.error("Vehículo no encontrado");
        }
    };

    const resetVehiculo = async () => {
        setBusquedaVehiculo("");
        const data = await fetchData("/vehiculos/listar");
        if (data?.vehiculos) setVehiculos(data.vehiculos);
    };

    const seleccionarVehiculo = (v) => {
        setDetalleVehiculo(v);
        setBusquedaVehiculo(v.placa);
        setForm({ ...form, vehiculo: v._id });
        toast.info("Vehículo seleccionado");
    };

    // ================================
    // Guardar Cambios
    // ================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await fetchData(`/reservas/actualizar/${id}`, form, "PUT");
            toast.success(res?.msg || "Reserva actualizada correctamente");
            navigate("/reservas/listar");
        } catch (err) {
            toast.error(err.response?.data?.msg || "Error al actualizar");
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
                    Panel de Edición: Reserva {form.codigo}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Código de Reserva *"
                            name="codigo"
                            value={form.codigo}
                            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                        />

                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1 text-[#E85A4F]">
                                Descripción
                            </label>
                            <textarea
                                value={form.descripcion}
                                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                                className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF8A75] outline-none resize-none"
                                rows="1"
                            />
                        </div>
                    </div>

                    {/* CLIENTES */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-[#E85A4F]">
                            Seleccionar Cliente *
                        </label>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Cédula o Apellido"
                                value={busquedaCliente}
                                onChange={(e) => setBusquedaCliente(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-[#FF8A75]"
                            />
                            <button type="button" onClick={buscarCliente}
                                className="bg-[#FF6F61] text-white px-3 py-2 rounded-xl text-sm hover:bg-[#E85A4F]">
                                Buscar
                            </button>
                            <button type="button" onClick={resetCliente}
                                className="bg-gray-400 text-white px-3 py-2 rounded-xl text-sm hover:bg-gray-500">
                                Reset
                            </button>
                        </div>

                        <div className="overflow-y-auto border rounded-2xl p-2 bg-[#FFF5F3] max-h-48 border-[#FFE5E1]">
                            {clientes.map(c => (
                                <div
                                    key={c._id}
                                    onClick={() => seleccionarCliente(c)}
                                    className={`p-3 cursor-pointer rounded-xl mb-1 text-sm transition-all ${
                                        detalleCliente?._id === c._id
                                            ? "bg-[#FF6F61] text-white shadow-md"
                                            : "hover:bg-[#FFE5E1] text-gray-700"
                                    }`}
                                >
                                    <span className="font-bold">{c.cedula}</span> - {c.nombre} {c.apellido}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* VEHÍCULOS */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-[#FF6F61]">
                            Seleccionar Vehículo *
                        </label>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Placa o Modelo"
                                value={busquedaVehiculo}
                                onChange={(e) => setBusquedaVehiculo(e.target.value)}
                                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-[#FF8A75]"
                            />
                            <button type="button" onClick={buscarVehiculo}
                                className="bg-[#FF8A75] text-white px-3 py-2 rounded-xl text-sm hover:bg-[#FF6F61]">
                                Buscar
                            </button>
                            <button type="button" onClick={resetVehiculo}
                                className="bg-gray-400 text-white px-3 py-2 rounded-xl text-sm hover:bg-gray-500">
                                Reset
                            </button>
                        </div>

                        <div className="overflow-y-auto border rounded-2xl p-2 bg-[#FFF5F3] max-h-48 border-[#FFE5E1]">
                            {vehiculos.map(v => (
                                <div
                                    key={v._id}
                                    onClick={() => seleccionarVehiculo(v)}
                                    className={`p-3 cursor-pointer rounded-xl mb-1 text-sm transition-all ${
                                        detalleVehiculo?._id === v._id
                                            ? "bg-[#FF8A75] text-white shadow-md"
                                            : "hover:bg-[#FFE5E1] text-gray-700"
                                    }`}
                                >
                                    <span className="font-bold">{v.placa}</span> - {v.marca} {v.modelo}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mt-10">
                    <button
                        type="button"
                        onClick={() => navigate("/reservas/listar")}
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

const Input = ({ label, ...props }) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-[#E85A4F]">{label}</label>
        <input
            {...props}
            className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#FF8A75] outline-none transition"
        />
    </div>
);

export default ReservaEdit;