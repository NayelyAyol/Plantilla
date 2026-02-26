import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";
import VehiculoForm from "../../components/vehiculos/VehiculoForm";

const VehiculoEdit = () => {
    const { id } = useParams(); // el _id que viene de la lista
    const fetchData = useFetch();
    const navigate = useNavigate();

    const [vehiculo, setVehiculo] = useState(null);
    const [loading, setLoading] = useState(false);

    // ==============================
    // OBTENER VEHÍCULO POR ID LOCAL
    // ==============================
    const fetchVehiculo = async () => {
        try {
            setLoading(true);
            const res = await fetchData("/vehiculos/listar"); // traemos todos
            const found = res?.vehiculos?.find(v => v._id === id); // filtramos localmente
            if (found) {
                setVehiculo(found);
            } else {
                toast.error("Vehículo no encontrado");
            }
        } catch (error) {
            toast.error(error?.error || "Error al obtener vehículo");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehiculo();
    }, [id]);

    // ==============================
    // ACTUALIZAR VEHÍCULO
    // ==============================
    const handleUpdate = async (formData) => {
        try {
            setLoading(true);
            await fetchData(`/vehiculos/actualizar/${id}`, formData, "PUT");
            toast.success("Vehículo actualizado correctamente");

            // redirigir a la lista
            navigate("/vehiculos/listar");
        } catch (error) {
            toast.error(error?.error || "Error al actualizar vehículo");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !vehiculo) return <p className="text-center mt-6">Cargando vehículo...</p>;
    if (!vehiculo) return <p className="text-center mt-6 text-red-500">Vehículo no encontrado</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-6">
            <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/40">
                <VehiculoForm
                    initialData={vehiculo}
                    onSubmit={handleUpdate}
                    loading={loading}
                    isEdit={true}
                />
            </div>
        </div>
    );
};

export default VehiculoEdit;