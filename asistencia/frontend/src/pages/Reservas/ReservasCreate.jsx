import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";
import TicketForm from "../../components/reservas/TicketForm";

const TicketCreate = () => {
    const navigate = useNavigate();
    const fetchData = useFetch();

    const initialState = { codigo: "", descripcion: "", cliente: "", tecnico: "" };
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);

    const [clientes, setClientes] = useState([]);
    const [busquedaCliente, setBusquedaCliente] = useState("");

    const [tecnicos, setTecnicos] = useState([]);
    const [busquedaTecnico, setBusquedaTecnico] = useState("");

    const cargarIniciales = async () => {
        try {
            const [dataC, dataT] = await Promise.all([
                fetchData("/clientes/listar"),
                fetchData("/tecnicos/listar")
            ]);
            if (dataC?.clientes) setClientes(dataC.clientes);
            if (dataT?.tecnicos) setTecnicos(dataT.tecnicos);
        } catch (error) { console.log(error); }
    };

    useEffect(() => { cargarIniciales(); }, []);

    // --- BÚSQUEDA DE CLIENTE ---
    const buscarCliente = async () => {
        if (!busquedaCliente.trim()) return toast.warning("Ingrese la cédula");
        try {
            // Tu backend usa: /api/clientes/buscar?cedula=XXX
            const data = await fetchData(`/clientes/buscar?cedula=${busquedaCliente.trim()}`);
            
            if (data?.cliente) {
                // Como tu backend devuelve un solo objeto, lo metemos en un array para el map
                setClientes([data.cliente]);
                toast.success("Cliente encontrado");
            }
        } catch (err) {
            toast.error("Cédula no encontrada");
            setClientes([]);
        }
    };

    const seleccionarCliente = (c) => {
        setForm(prev => ({ ...prev, cliente: c._id }));
        setBusquedaCliente(c.cedula);
        toast.info(`Cliente: ${c.apellido} seleccionado`);
    };

    const resetCliente = () => {
        setBusquedaCliente("");
        setForm(prev => ({ ...prev, cliente: "" }));
        cargarIniciales();
    };

    // --- BÚSQUEDA DE TÉCNICO ---
    const buscarTecnico = async () => {
        if (!busquedaTecnico.trim()) return toast.warning("Ingrese la cédula");
        try {
            // Tu backend usa: /api/tecnicos/buscar?cedula=XXX
            const data = await fetchData(`/tecnicos/buscar?cedula=${busquedaTecnico.trim()}`);
            
            if (data?.tecnico) {
                setTecnicos([data.tecnico]);
                toast.success("Técnico encontrado");
            }
        } catch (err) {
            toast.error("Técnico no encontrado");
            setTecnicos([]);
        }
    };

    const seleccionarTecnico = (t) => {
        setForm(prev => ({ ...prev, tecnico: t._id }));
        setBusquedaTecnico(t.cedula);
        toast.info(`Técnico: ${t.apellido} seleccionado`);
    };

    const resetTecnico = () => {
        setBusquedaTecnico("");
        setForm(prev => ({ ...prev, tecnico: "" }));
        cargarIniciales();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.descripcion.length < 10) return toast.error("Descripción muy corta");
        if (!form.cliente || !form.tecnico) return toast.error("Seleccione Cliente y Técnico");

        try {
            setLoading(true);
            const res = await fetchData("/tickets/crear", {
                ...form,
                codigo: form.codigo.toUpperCase().trim()
            }, "POST");
            toast.success(res?.msg || "Ticket Creado");
            navigate("/tickets/listar");
        } catch (err) {
            toast.error(err.response?.data?.msg || "Error 400: Datos inválidos");
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen p-6 bg-[#FFF5F3]">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl border border-[#FFE5E1] max-w-5xl mx-auto mt-8">
                <h2 className="text-2xl font-bold mb-8 text-[#FF6F61] text-center">Crear Nuevo Ticket</h2>
                <TicketForm 
                    form={form} setForm={setForm}
                    clientes={clientes} busquedaCliente={busquedaCliente} setBusquedaCliente={setBusquedaCliente}
                    buscarCliente={buscarCliente} resetCliente={resetCliente} seleccionarCliente={seleccionarCliente}
                    tecnicos={tecnicos} busquedaTecnico={busquedaTecnico} setBusquedaTecnico={setBusquedaTecnico}
                    buscarTecnico={buscarTecnico} resetTecnico={resetTecnico} seleccionarTecnico={seleccionarTecnico}
                />
                <div className="flex gap-4 mt-10">
                    <button type="button" onClick={() => navigate("/tickets/listar")} className="flex-1 bg-gray-200 py-3 rounded-xl font-bold">Cancelar</button>
                    <button type="submit" disabled={loading} className="flex-[2] bg-[#FF6F61] text-white py-3 rounded-xl font-bold shadow-lg">
                        {loading ? "Guardando..." : "Crear Ticket"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TicketCreate;