import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";
import TecnicoForm from "../../components/vehiculos/TecnicoForm";

const TecnicoEdit = () => {
    const { id } = useParams(); // el _id que viene de la lista
    const fetchData = useFetch();
    const navigate = useNavigate();

    const [tecnico, setTecnico] = useState(null);
    const [loading, setLoading] = useState(false);

    // ==============================
    // OBTENER TÉCNICO POR ID
    // ==============================
    const fetchTecnico = async () => {
        try {
            setLoading(true);
            const res = await fetchData(`/tecnicos/buscarid/${id}`); // usamos la ruta por ID
            if (res?.tecnico) {
                setTecnico(res.tecnico);
            } else {
                toast.error("Técnico no encontrado");
            }
        } catch (error) {
            toast.error(error?.error || "Error al obtener técnico");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTecnico();
    }, [id]);

    // ==============================
    // ACTUALIZAR TÉCNICO
    // ==============================
    const handleUpdate = async (formData) => {
        try {
            setLoading(true);
            await fetchData(`/tecnicos/actualizar/${id}`, formData, "PUT");
            toast.success("Técnico actualizado correctamente");

            // redirigir a la lista
            navigate("/tecnicos/listar");
        } catch (error) {
            toast.error(error?.error || "Error al actualizar técnico");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !tecnico) return <p className="text-center mt-6">Cargando técnico...</p>;
    if (!tecnico) return <p className="text-center mt-6 text-red-500">Técnico no encontrado</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-6">
            <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/40">
                <TecnicoForm
                    initialData={tecnico}
                    onSubmit={handleUpdate}
                    loading={loading}
                    isEdit={true}
                />
            </div>
        </div>
    );
};

export default TecnicoEdit;