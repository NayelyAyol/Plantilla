import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";
import VehiculoForm from "../../components/vehiculos/VehiculoForm";

const VehiculoCreate = () => {
    const fetchData = useFetch();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreate = async (formData) => {
        try {
            setLoading(true);

            const res = await fetchData("/vehiculos/crear", formData, "POST");

            if (res?.error) {
                toast.error(res.error);
                return;
            }

            toast.success(res?.message || "Vehículo creado correctamente");

            setTimeout(() => {
                navigate("/vehiculos/listar");
            }, 1500);

        } catch (err) {
            toast.error(err?.response?.data?.error || "Error al crear vehículo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <VehiculoForm
                initialData={{
                    marca: "",
                    modelo: "",
                    anio_fabricacion: "",
                    placa: "",
                    color: "",
                    tipo_vehiculo: "",
                    kilometraje: "",
                    descripcion: ""
                }}
                onSubmit={handleCreate}
                loading={loading}
                isEdit={false}
            />
        </div>
    );
};

export default VehiculoCreate;