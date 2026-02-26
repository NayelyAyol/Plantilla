import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { ThemeContext } from "../../context/ThemeContext"
import { MdLogout, MdDarkMode, MdLightMode } from "react-icons/md"

const Header = () => {

    const navigate = useNavigate()
    const { logout, user } = useContext(AuthContext)
    const { darkMode, toggleTheme } = useContext(ThemeContext)

    return (
        <header className="
            w-full 
            bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500
            dark:from-rose-600 dark:via-orange-600 dark:to-red-700
            text-white 
            flex justify-between items-center 
            px-6 py-4
            shadow-lg
        ">

            <div>
                <h1 className="text-xl font-bold">
                    Sistema de Reservas
                </h1>
                <p className="text-sm text-white/80">
                    Bienvenido {user?.nombre}
                </p>
            </div>

            <div className="flex items-center gap-4">

                <button
                    onClick={toggleTheme}
                    className="bg-white/20 hover:bg-white/30 
                                p-2 rounded-xl transition"
                >
                    {darkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
                </button>

                <button
                    onClick={() => {
                        logout()
                        navigate("/")
                    }}
                    className="bg-white/20 hover:bg-white/30 
                                px-4 py-2 rounded-xl transition"
                >
                    Cerrar sesión
                </button>

            </div>
        </header>
    )
}

export default Header