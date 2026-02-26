import { useNavigate } from "react-router-dom"
import { useState, useContext, useRef, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import { MdAccountCircle } from "react-icons/md"

const Header = () => {

    const navigate = useNavigate()
    const { logout } = useContext(AuthContext)
    const [openMenu, setOpenMenu] = useState(false)
    const menuRef = useRef(null)

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <header className="w-full bg-gradient-to-r  from-blue-500 to-blue-500 
                           text-white flex justify-between items-center 
                           px-4 sm:px-8 lg:px-12 py-3 shadow-md">

            <h1 className="text-lg font-semibold tracking-wide">
                Sistema Académico
            </h1>

            <div className="relative" ref={menuRef}>

                <button
                    onClick={() => setOpenMenu(!openMenu)}
                    className="flex items-center justify-center 
                               w-10 h-10 
                               rounded-full 
                               hover:bg-white/20 
                               transition-all duration-300"
                >
                    <MdAccountCircle className="text-8xl" />
                </button>

                {openMenu && (
                    <div className="absolute right-0 mt-3 
                                    bg-white text-gray-800 
                                    rounded-xl shadow-xl 
                                    w-44 py-2 
                                    border border-gray-200">

                        <button
                            onClick={handleLogout}
                            className="w-full text-center 
                                       px-4 py-2 
                                       text-sm font-medium
                                       hover:bg-gray-100 
                                       transition-all duration-200"
                        >
                            Cerrar Sesión
                        </button>

                    </div>
                )}

            </div>
        </header>
    )
}

export default Header