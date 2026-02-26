import { useNavigate } from "react-router-dom"
import { MdMenuBook, MdSchool, MdDescription } from "react-icons/md"
import HomeLayout from "./../components/layout/HomeLayout"

const Home = () => {

    const navigate = useNavigate()

    const cardBaseStyle = `
        group
        backdrop-blur-xl
        border
        rounded-3xl
        shadow-lg
        hover:shadow-2xl
        hover:-translate-y-2
        transition-all duration-300
        p-10
        flex flex-col
        items-center
        justify-center
        gap-6
        cursor-pointer
        
        /* LIGHT */
        bg-white/60 border-white/40
        
        /* DARK */
        dark:bg-[#1f1f1f]/80
        dark:border-[#ff6f61]/30
    `

    return (
        <HomeLayout>

            <div className="
                min-h-screen
                px-6 py-16
                transition-all duration-300
                
                /* LIGHT */
                bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50
                
                /* DARK */
                dark:bg-gradient-to-br dark:from-[#121212] dark:via-[#1a1a1a] dark:to-[#111111]
            ">

                {/* ===== TÍTULO ===== */}
                <div className="text-center mb-16">
                    <h1 className="
                        text-3xl md:text-4xl font-bold
                        bg-gradient-to-r from-rose-500 to-orange-500
                        bg-clip-text text-transparent
                        dark:from-[#ff6f61] dark:to-[#ff9472]
                    ">
                        Panel Principal
                    </h1>

                    <p className="
                        mt-4 text-sm md:text-base
                        text-gray-600
                        dark:text-gray-300
                    ">
                        Selecciona un módulo para comenzar
                    </p>

                    <div className="
                        w-32 h-1.5
                        mx-auto mt-6 rounded-full
                        bg-gradient-to-r from-rose-400 to-orange-400
                        dark:from-[#ff6f61] dark:to-[#ff9472]
                    ">
                    </div>
                </div>

                {/* ===== TARJETAS ===== */}
                <div className="
                    grid
                    grid-cols-1 
                    sm:grid-cols-2 
                    lg:grid-cols-3 
                    gap-10 
                    max-w-6xl 
                    mx-auto
                ">

                    {/* ===== CLIENTES ===== */}
                    <div
                        className={cardBaseStyle}
                        onClick={() => navigate("/clientes")}
                    >
                        <MdMenuBook className="
                            text-7xl
                            text-rose-500
                            dark:text-[#ff6f61]
                            group-hover:scale-110
                            transition duration-300
                        " />

                        <span className="
                            text-xl font-semibold
                            text-gray-700
                            dark:text-gray-200
                        ">
                            Clientes
                        </span>
                    </div>

                    {/* ===== RESERVAS ===== */}
                    <div
                        className={cardBaseStyle}
                        onClick={() => navigate("/tecnicos")}
                    >
                        <MdSchool className="
                            text-7xl
                            text-orange-500
                            dark:text-[#ff9472]
                            group-hover:scale-110
                            transition duration-300
                        " />

                        <span className="
                            text-xl font-semibold
                            text-gray-700
                            dark:text-gray-200
                        ">
                            Tecnico
                        </span>
                    </div>

                    {/* ===== VEHICULOS ===== */}
                    <div
                        className={cardBaseStyle}
                        onClick={() => navigate("/tickets")}
                    >
                        <MdDescription className="
                            text-7xl
                            text-amber-500
                            dark:text-[#ffb88c]
                            group-hover:scale-110
                            transition duration-300
                        " />

                        <span className="
                            text-xl font-semibold
                            text-gray-700
                            dark:text-gray-200
                        ">
                            Tickets
                        </span>
                    </div>

                </div>

            </div>

        </HomeLayout>
    )
}

export default Home