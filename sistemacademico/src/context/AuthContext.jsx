import { createContext, useState } from "react"

export const AuthContext = createContext()

const API = import.meta.env.VITE_API_URL

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  )

  const login = async (data) => {
    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.msg)
        return false
      }

      // Guardamos token y usuario
      localStorage.setItem("token", result.token)
      localStorage.setItem("user", JSON.stringify(result.usuario))

      setUser(result.usuario)

      return true

    } catch (error) {
      console.error(error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}