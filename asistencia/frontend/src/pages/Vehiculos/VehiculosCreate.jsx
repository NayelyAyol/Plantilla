import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFetch } from "../../hooks/useFetch";
import TecnicoForm from "../../components/vehiculos/TecnicoForm";

const TecnicoCreate = () => {
    const fetchData = useFetch();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreate = async (formData) => {
        try {
            setLoading(true);

            const res = await fetchData("/tecnicos/crear", formData, "POST");

            if (res?.error) {
                toast.error(res.error);
                return;
            }

            toast.success(res?.message || "Técnico creado correctamente");

            setTimeout(() => {
                navigate("/tecnicos/listar");
            }, 1500);

        } catch (err) {
            toast.error(err?.response?.data?.error || "Error al crear técnico");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <TecnicoForm
                initialData={{
                    nombre: "",
                    apellido: "",
                    cedula: "",
                    fecha_nacimiento: "",
                    genero: "",
                    ciudad: "",
                    direccion: "",
                    telefono: "",
                    email: ""
                }}
                onSubmit={handleCreate}
                loading={loading}
                isEdit={false}
            />
        </div>
    );
};

export default TecnicoCreate;