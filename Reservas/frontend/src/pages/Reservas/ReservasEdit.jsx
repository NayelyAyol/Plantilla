import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import ReservaForm from "../../components/reservas/ReservaForm";

const ReservaEdit = () => {
    const { id } = useParams();
    const fetchData = useFetch();
    const [reserva, setReserva] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarReserva = async () => {
            const data = await fetchData("/reservas/listar");
            const encontrada = data?.reservas?.find(r => r._id === id);
            if (encontrada) setReserva(encontrada);
            setLoading(false);
        };

        cargarReserva();
    }, [id]);

    if (loading) return <p className="text-center mt-10">Cargando...</p>;
    if (!reserva) return <p className="text-center mt-10">Reserva no encontrada</p>;

    return (
        <ReservaForm
            mode="edit"
            initialData={reserva}
            reservaId={id}
        />
    );
};

export default ReservaEdit;