import { Link, useLocation, useNavigate } from "react-router-dom"
import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import {
    MdArrowBack,
    MdPeople,
    MdMenuBook,
    MdAssignment,
    MdMenu
} from "react-icons/md"

const Sidebar = () => {

    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation()
    const [open, setOpen] = useState(false)

    const urlActual = location.pathname

    const linkStyle = (path) =>
        `${urlActual.startsWith(path)
            ? "bg-gray-900 text-white shadow-lg"
            : "text-gray-400 hover:bg-gray-700 hover:text-white"
        } block px-4 py-2 rounded-lg transition text-sm md:text-base font-medium`

    return (
        <>
            {/* ===== BOTÓN MOBILE ===== */}
            <div className="md:hidden flex justify-between items-center bg-slate-800 p-4 text-white">
                <h2 className="font-semibold text-base">Menú</h2>
                <button onClick={() => setOpen(!open)}>
                    <MdMenu size={26} />
                </button>
            </div>

            {/* ===== SIDEBAR ===== */}
            <div className={`
    ${open ? "fixed inset-0 z-50" : "hidden"} 
    md:static md:block
    w-full md:w-1/5
    bg-slate-800 text-white
    min-h-screen
    shadow-2xl
    p-4 md:p-6
`}>

                {/* 🔥 IMPORTANTE: sin min-h-screen aquí */}
                <div className="flex flex-col h-full">

                    {/* ===== PARTE SUPERIOR ===== */}
                    <div className="flex-1">

                        {/* Avatar */}
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
                            alt="avatar"
                            className="m-auto mt-4 p-1 border-2 border-slate-500 rounded-full"
                            width={80}
                        />

                        {/* Usuario */}
                        <p className="text-center text-sm md:text-base text-slate-300 mt-4 font-medium">
                            <span className="bg-green-600 w-2 h-2 md:w-3 md:h-3 inline-block rounded-full mr-2"></span>
                            Bienvenido - {user?.nombre || "Usuario"}
                        </p>

                        <hr className="mt-6 border-slate-600" />

                        {/* ===== NAVEGACIÓN ===== */}
                        <nav className="mt-6 flex flex-col gap-6">

                            {/* ================= ESTUDIANTES ================= */}
                            {urlActual.startsWith("/estudiantes") && (
                                <div>
                                    <p className="flex items-center gap-2 text-gray-400 text-xs md:text-sm mb-2">
                                        <MdPeople /> Estudiantes
                                    </p>

                                    <div className="flex flex-col gap-2">
                                        <Link to="/estudiantes/crear" className={linkStyle("/estudiantes/crear")} onClick={() => setOpen(false)}>Crear</Link>
                                        <Link to="/estudiantes/listar" className={linkStyle("/estudiantes/listar")} onClick={() => setOpen(false)}>Listar</Link>
                                        <Link to="/estudiantes/buscar" className={linkStyle("/estudiantes/buscar")} onClick={() => setOpen(false)}>Buscar</Link>
                                    </div>
                                </div>
                            )}

                            {/* ================= MATERIAS ================= */}
                            {urlActual.startsWith("/materias") && (
                                <div>
                                    <p className="flex items-center gap-2 text-gray-400 text-xs md:text-sm mb-2">
                                        <MdMenuBook /> Materias
                                    </p>

                                    <div className="flex flex-col gap-2">
                                        <Link to="/materias/crear" className={linkStyle("/materias/crear")} onClick={() => setOpen(false)}>Crear</Link>
                                        <Link to="/materias/listar" className={linkStyle("/materias/listar")} onClick={() => setOpen(false)}>Listar</Link>
                                        <Link to="/materias/buscarMateria" className={linkStyle("/materias/buscarMateria")} onClick={() => setOpen(false)}>Buscar</Link>
                                    </div>
                                </div>
                            )}

                            {/* ================= MATRÍCULAS ================= */}
                            {urlActual.startsWith("/matriculas") && (
                                <div>
                                    <p className="flex items-center gap-2 text-gray-400 text-xs md:text-sm mb-2">
                                        <MdAssignment /> Matrículas
                                    </p>

                                    <div className="flex flex-col gap-2">
                                        <Link to="/matriculas/crear" className={linkStyle("/matriculas/crear")} onClick={() => setOpen(false)}>Crear</Link>
                                        <Link to="/matriculas/listar" className={linkStyle("/matriculas/listar")} onClick={() => setOpen(false)}>Listar</Link>
                                        <Link to="/matriculas/buscarMatricula" className={linkStyle("/matriculas/buscarMatricula")} onClick={() => setOpen(false)}>Buscar</Link>
                                    </div>
                                </div>
                            )}

                        </nav>
                    </div>

                    {/* ===== PARTE INFERIOR ===== */}
                    <div className="border-t border-slate-600 pt-4 mt-6">
                        <button
                            onClick={() => navigate("/paginaPrincipal")}
                            className="flex items-center justify-center gap-2 
        text-sm md:text-lg font-medium 
        bg-emerald-600 hover:bg-emerald-700 
        py-2 px-3
        rounded-lg transition w-full
        whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                            <MdArrowBack className="text-lg md:text-xl flex-shrink-0" />
                            <span className="truncate">Regresar</span>
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Sidebar