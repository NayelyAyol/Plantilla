import { Link, useLocation, useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import {
    MdArrowBack,
    MdPeople,
    MdMenuBook,
    MdAssignment,
    MdMenu,
    MdClose
} from "react-icons/md"

const Sidebar = () => {

    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation()
    const [open, setOpen] = useState(false)

    const urlActual = location.pathname

    const linkStyle = (path) =>
        `${urlActual.startsWith(path)
            ? `
              bg-white/20 
              text-white 
              shadow-md 
              dark:bg-[#ff6f61]/30 
              dark:text-white
              `
            : `
              text-white/90 
              hover:bg-white/10 
              hover:text-white
              dark:text-gray-300
              dark:hover:bg-[#ff6f61]/20
              dark:hover:text-white
              `
        } block px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium`;

    return (
        <>
            {/* ===== MOBILE HEADER ===== */}
            <div className="md:hidden flex justify-between items-center 
                            p-4 text-white shadow-md
                            bg-gradient-to-r from-rose-600 to-orange-700
                            dark:from-[#1f1f1f] dark:to-[#121212]">
                <h2 className="font-semibold text-base">Sistema de Reservas</h2>
                <button onClick={() => setOpen(!open)}>
                    {open ? <MdClose size={26} /> : <MdMenu size={26} />}
                </button>
            </div>

            {/* ===== OVERLAY MOBILE ===== */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* ===== SIDEBAR ===== */}
            <div className={`
                fixed md:static z-50
                ${open ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0
                transition-transform duration-300
                w-72 md:w-64
                min-h-screen
                text-white
                shadow-2xl
                p-6
                bg-gradient-to-b from-rose-700 via-rose-800 to-orange-900
                dark:bg-gradient-to-b dark:from-[#181818] dark:via-[#1f1f1f] dark:to-[#121212]
            `}>
                <div className="flex flex-col h-full">

                    {/* USER INFO */}
                    <div className="text-center mb-8">
                        <div className="
                            w-16 h-16 mx-auto rounded-full flex items-center justify-center text-xl font-bold
                            bg-white/20 dark:bg-[#ff6f61]/30 dark:text-white">
                            {user?.nombre?.charAt(0) || "U"}
                        </div>
                        <p className="mt-4 text-sm text-white/80 dark:text-gray-400">Bienvenido</p>
                        <p className="font-semibold dark:text-white">{user?.nombre || "Usuario"}</p>
                    </div>

                    {/* NAV */}
                    <nav className="flex-1 flex flex-col gap-6">

                        {/* CLIENTES */}
                        {urlActual.startsWith("/clientes") && (
                            <div>
                                <p className="flex items-center gap-2 text-white/70 dark:text-gray-400 text-xs mb-3 uppercase tracking-wide">
                                    <MdPeople /> Clientes
                                </p>
                                <div className="flex flex-col gap-2">
                                    <Link to="/clientes/crear" className={linkStyle("/clientes/crear")} onClick={() => setOpen(false)}>Crear</Link>
                                    <Link to="/clientes/listar" className={linkStyle("/clientes/listar")} onClick={() => setOpen(false)}>Listar</Link>
                                    <Link to="/clientes/buscar" className={linkStyle("/clientes/buscar")} onClick={() => setOpen(false)}>Buscar</Link>
                                </div>
                            </div>
                        )}

                        {/* RESERVAS */}
                        {urlActual.startsWith("/tickets") && (
                            <div>
                                <p className="flex items-center gap-2 text-white/70 dark:text-gray-400 text-xs mb-3 uppercase tracking-wide">
                                    <MdAssignment /> Tickets
                                </p>
                                <div className="flex flex-col gap-2">
                                    <Link to="/tickets/crear" className={linkStyle("/tickets/crear")} onClick={() => setOpen(false)}>Crear</Link>
                                    <Link to="/tickets/listar" className={linkStyle("/tickets/listar")} onClick={() => setOpen(false)}>Listar</Link>
                                    <Link to="/tickets/buscar" className={linkStyle("/tickets/buscar")} onClick={() => setOpen(false)}>Buscar</Link>
                                </div>
                            </div>
                        )}

                        {/* VEHÍCULOS */}
                        {urlActual.startsWith("/tecnicos") && (
                            <div>
                                <p className="flex items-center gap-2 text-white/70 dark:text-gray-400 text-xs mb-3 uppercase tracking-wide">
                                    <MdMenuBook /> Tecnicos
                                </p>
                                <div className="flex flex-col gap-2">
                                    <Link to="/tecnicos/crear" className={linkStyle("/tecnicos/crear")} onClick={() => setOpen(false)}>Crear</Link>
                                    <Link to="/tecnicos/listar" className={linkStyle("/tecnicos/listar")} onClick={() => setOpen(false)}>Listar</Link>
                                    <Link to="/tecnicos/buscar" className={linkStyle("/tecnicos/buscar")} onClick={() => setOpen(false)}>Buscar</Link>
                                </div>
                            </div>
                        )}

                    </nav>

                    {/* BACK BUTTON */}
                    <div className="mt-8">
                        <button
                            onClick={() => navigate("/home")}
                            className="
                                w-full flex items-center justify-center gap-2
                                py-2 px-4
                                rounded-xl
                                font-medium
                                shadow-md
                                transition-all duration-300
                                bg-gradient-to-r from-rose-500 to-orange-500
                                hover:from-rose-600 hover:to-orange-600
                                dark:bg-gradient-to-r dark:from-[#ff6f61] dark:to-[#ff9472]
                                dark:hover:from-[#ff5a4f] dark:hover:to-[#ff8560]
                            "
                        >
                            <MdArrowBack /> Regresar
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Sidebar