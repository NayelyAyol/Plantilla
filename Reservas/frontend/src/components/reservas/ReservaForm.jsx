import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";

const ReservaForm = () => {
    const navigate = useNavigate();
    const fetchData = useFetch();

    const initialState = { codigo: "", descripcion: "", cliente: "", vehiculo: "" };
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);

    // ================================
    // Clientes
    // ================================
    const [clientes, setClientes] = useState([]);
    const [busquedaCliente, setBusquedaCliente] = useState("");
    const [detalleCliente, setDetalleCliente] = useState(null);
    const [errorsCliente, setErrorsCliente] = useState({});

    // ================================
    // Vehículos
    // ================================
    const [vehiculos, setVehiculos] = useState([]);
    const [busquedaVehiculo, setBusquedaVehiculo] = useState("");
    const [detalleVehiculo, setDetalleVehiculo] = useState(null);
    const [errorsVehiculo, setErrorsVehiculo] = useState({});

    // ================================
    // Cargar datos iniciales
    // ================================
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const dataClientes = await fetchData("/clientes/listar");
                if (dataClientes?.clientes) setClientes(dataClientes.clientes);

                const dataVehiculos = await fetchData("/vehiculos/listar");
                if (dataVehiculos?.vehiculos) setVehiculos(dataVehiculos.vehiculos);
            } catch {
                toast.error("Error al cargar datos iniciales");
            }
        };
        cargarDatos();
    }, []);

    // ================================
    // Manejo de formulario
    // ================================
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });


    // ================================
    // Búsqueda y selección de cliente
    // ================================
    const buscarCliente = async () => {
        if (!busquedaCliente.trim()) {
            setErrorsCliente({ busqueda: "Ingrese cédula o apellido" });
            return;
        }
        try {
            setDetalleCliente(null);
            setErrorsCliente({});
            const valor = busquedaCliente.trim();
            const esNumero = /^\d+$/.test(valor);
            const url = esNumero
                ? `/clientes/buscar?cedula=${valor}`
                : `/clientes/buscar?apellido=${valor}`;

            const data = await fetchData(url);
            if (!data?.clientes || data.clientes.length === 0) {
                toast.error("No se encontraron clientes");
                setClientes([]);
                return;
            }

            setClientes(data.clientes);
            if (data.clientes.length === 1) {
                setDetalleCliente(data.clientes[0]);
                setForm({ ...form, cliente: data.clientes[0]._id });
                toast.success("Cliente encontrado");
            } else {
                toast.success("Resultados encontrados");
            }
        } catch {
            toast.error("Error al buscar cliente");
        }
    };

    const resetCliente = () => {
        setBusquedaCliente("");
        setDetalleCliente(null);
        setClientes([]);
        setErrorsCliente({});
    };

    const seleccionarCliente = (c) => {
        setDetalleCliente(c);
        setBusquedaCliente(`${c.nombre} ${c.apellido} (${c.cedula})`);
        setForm({ ...form, cliente: c._id });
        toast.info("Cliente seleccionado");
    };

    // ================================
    // Búsqueda y selección de vehículo
    // ================================
    const buscarVehiculo = async () => {
        if (!busquedaVehiculo.trim()) {
            setErrorsVehiculo({ busqueda: "Ingrese placa o modelo" });
            return;
        }
        try {
            setDetalleVehiculo(null);
            setErrorsVehiculo({});
            const valor = busquedaVehiculo.trim();
            const dataPlaca = await fetchData(`/vehiculos/buscar?placa=${valor}`);
            let data = dataPlaca;
            if (!data?.vehiculos || data.vehiculos.length === 0) {
                const dataModelo = await fetchData(`/vehiculos/buscar?modelo=${valor}`);
                data = dataModelo;
            }

            if (!data?.vehiculos || data.vehiculos.length === 0) {
                toast.error("No se encontraron vehículos");
                setVehiculos([]);
                return;
            }

            setVehiculos(data.vehiculos);
            if (data.vehiculos.length === 1) {
                setDetalleVehiculo(data.vehiculos[0]);
                setForm({ ...form, vehiculo: data.vehiculos[0]._id });
                toast.success("Vehículo encontrado");
            } else {
                toast.success("Resultados encontrados");
            }
        } catch {
            toast.error("Error al buscar vehículo");
        }
    };

    const resetVehiculo = () => {
        setBusquedaVehiculo("");
        setDetalleVehiculo(null);
        setVehiculos([]);
        setErrorsVehiculo({});
    };

    const seleccionarVehiculo = (v) => {
        setDetalleVehiculo(v);
        setBusquedaVehiculo(`${v.marca} ${v.modelo} (${v.placa})`);
        setForm({ ...form, vehiculo: v._id });
        toast.info("Vehículo seleccionado");
    };

    // ================================
    // Enviar formulario
    // ================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.codigo || !form.cliente || !form.vehiculo) {
            toast.error("Complete todos los campos obligatorios");
            return;
        }

        try {
            setLoading(true);

            const res = await fetchData("/reservas/crear", form, "POST");

            toast.success(res?.msg || "Reserva creada correctamente");

            setForm(initialState);
            resetCliente();
            resetVehiculo();

            setTimeout(() => {
                navigate("/reservas/listar");
            }, 1000);

        } catch (err) {
            toast.error(err.response?.data?.msg || "Error del servidor");
        } finally {
            setLoading(false);
        }
    };
    // ================================
    // Render
    // ================================
    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/40 max-w-5xl mx-auto mt-8"
        >
            <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent text-center">
                Crear Nueva Reserva
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Código *" name="codigo" value={form.codigo} onChange={handleChange} placeholder="Ej: RST-001" />
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Descripción</label>
                    <textarea
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        placeholder="Opcional"
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-400 outline-none resize-none"
                    />
                </div>

                {/* Cliente */}
                <div>
                    <label className="block text-sm font-medium mb-1">Cliente *</label>
                    <div className="flex gap-2 mb-2 flex-col sm:flex-row">
                        <input
                            type="text"
                            placeholder="Cédula o apellido"
                            value={busquedaCliente}
                            onChange={(e) => setBusquedaCliente(e.target.value)}
                            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-400 outline-none"
                        />
                        <button type="button" onClick={buscarCliente} className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl transition">
                            Buscar
                        </button>
                        <button type="button" onClick={resetCliente} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl transition">
                            Reset
                        </button>
                    </div>
                    {errorsCliente.busqueda && (
                        <div className="text-red-500 text-xs mb-2">{errorsCliente.busqueda}</div>
                    )}
                    <div className="overflow-y-auto border rounded-xl p-2 bg-gray-50 max-h-32 sm:max-h-40">
                        {clientes.length === 0 ? <p className="text-gray-400">No hay clientes</p> :
                            clientes.map(c => (
                                <div
                                    key={c._id}
                                    className={`p-2 cursor-pointer hover:bg-gray-200 rounded-xl ${detalleCliente?._id === c._id ? "bg-rose-100" : ""}`}
                                    onClick={() => seleccionarCliente(c)}
                                >
                                    {c.nombre} {c.apellido} - {c.cedula}
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* Vehículo */}
                <div>
                    <label className="block text-sm font-medium mb-1">Vehículo *</label>
                    <div className="flex gap-2 mb-2 flex-col sm:flex-row">
                        <input
                            type="text"
                            placeholder="Placa"
                            value={busquedaVehiculo}
                            onChange={(e) => setBusquedaVehiculo(e.target.value)}
                            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-400 outline-none"
                        />
                        <button type="button" onClick={buscarVehiculo} className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl transition">
                            Buscar
                        </button>
                        <button type="button" onClick={resetVehiculo} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl transition">
                            Reset
                        </button>
                    </div>
                    {errorsVehiculo.busqueda && (
                        <div className="text-red-500 text-xs mb-2">{errorsVehiculo.busqueda}</div>
                    )}
                    <div className="overflow-y-auto border rounded-xl p-2 bg-gray-50 max-h-32 sm:max-h-40">
                        {vehiculos.length === 0 ? <p className="text-gray-400">No hay vehículos</p> :
                            vehiculos.map(v => (
                                <div
                                    key={v._id}
                                    className={`p-2 cursor-pointer hover:bg-gray-200 rounded-xl ${detalleVehiculo?._id === v._id ? "bg-rose-100" : ""}`}
                                    onClick={() => seleccionarVehiculo(v)}
                                >
                                    {v.marca} {v.modelo} - {v.placa}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="mt-10 w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-300"
            >
                {loading ? "Guardando..." : "Crear Reserva"}
            </button>
        </form>
    );
}

// ---------------------------
// INPUT SIMPLE
// ---------------------------
const Input = ({ label, error, ...props }) => (
    <div className="relative">
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
            {...props}
            className={`w-full px-4 py-2 rounded-xl border ${error ? "border-red-500" : "border-gray-300"} focus:ring-2 ${error ? "focus:ring-red-400" : "focus:ring-rose-400"} outline-none transition`}
        />
        {error && (
            <div className="absolute top-0 right-0 mt-1 mr-0 bg-rose-100 text-rose-800 text-xs px-2 py-1 rounded shadow-lg z-10">
                {error}
            </div>
        )}
    </div>
);

export default ReservaForm;