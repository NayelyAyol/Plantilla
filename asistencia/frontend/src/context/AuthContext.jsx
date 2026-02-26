import { createContext, useState, useEffect } from "react"
import { useFetch } from "../hooks/useFetch"
import { toast } from "react-toastify"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const fetchData = useFetch()

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const login = async (data) => {
        try {

            const res = await fetchData("/auth/login", data, "POST")

            localStorage.setItem("token", res.token)
            localStorage.setItem("user", JSON.stringify(res.usuario))

            setUser(res.usuario)

            toast.success(res.msg)
            return true

        } catch (error) {
            toast.error(error.response?.data?.msg || "Error al iniciar sesión")
            return false
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}