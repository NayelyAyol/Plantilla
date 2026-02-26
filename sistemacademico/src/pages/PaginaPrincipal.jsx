import { useNavigate } from "react-router-dom"
import { MdMenuBook, MdSchool, MdDescription } from "react-icons/md"
import MainLayout from "../components/Layouts/MainLayout"

const PaginaPrincipal = () => {

    const navigate = useNavigate()

    return (
        <MainLayout>

            {/* TÍTULO */}
            <div className="flex flex-col justify-center items-center mt-20 mb-20 text-center px-4">
                <span className="text-2xl font-extrabold text-blue-800">
                    Operaciones Disponibles
                </span>
                <div className="w-60 h-1.5 bg-gradient-to-r from-blue-500 to-blue-700 mt-4 rounded-full"></div>
            </div>

            {/* BOTONES */}
            <div className="flex justify-center items-center pb-20">
                <div className="flex flex-wrap gap-32 justify-center">

                    {/* Materias */}
                    <button
                        className="flex flex-col justify-center items-center
                                    bg-gradient-to-br from-blue-400 to-blue-600
                                    hover:from-blue-500 hover:to-blue-700
                                    text-white p-14 rounded-3xl 
                                    gap-6 w-[250px] h-[250px]
                                    shadow-xl border border-white/30
                                    hover:scale-105 hover:shadow-2xl
                                    transition-all duration-300"
                        onClick={() => navigate("/materias")}
                    >
                        <MdMenuBook className="text-[180px]" />
                        <span className="text-2xl font-bold">
                            Materias
                        </span>
                    </button>

                    {/* Estudiantes */}
                    <button
                        className="flex flex-col justify-center items-center
                                    bg-gradient-to-br from-indigo-400 to-indigo-600
                                    hover:from-indigo-500 hover:to-indigo-700
                                    text-white p-14 rounded-3xl 
                                    gap-6 w-[250px] h-[250px]
                                    shadow-xl border border-white/30
                                    hover:scale-105 hover:shadow-2xl
                                    transition-all duration-300"
                        onClick={() => navigate("/estudiantes")}
                    >
                        <MdSchool className="text-[180px]" />
                        <span className="text-2xl font-bold">
                            Estudiantes
                        </span>
                    </button>

                    {/* Matrículas */}
                    <button
                        className="flex flex-col justify-center items-center
                                    bg-gradient-to-br from-sky-400 to-sky-600
                                    hover:from-sky-500 hover:to-sky-700
                                    text-white p-14 rounded-3xl 
                                    gap-6 w-[250px] h-[250px]
                                    shadow-xl border border-white/30
                                    hover:scale-105 hover:shadow-2xl
                                    transition-all duration-300"
                        onClick={() => navigate("/matriculas")}
                    >
                        <MdDescription className="text-[180px]" />
                        <span className="text-2xl font-bold">
                            Matrículas
                        </span>
                    </button>

                </div>
            </div>

        </MainLayout>
    )
}

export default PaginaPrincipal