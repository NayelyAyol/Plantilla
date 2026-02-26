import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { AuthContext } from "../context/AuthContext"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { ToastContainer } from "react-toastify"

const Login = () => {

    const [showPassword, setShowPassword] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm()
    const { login, user } = useContext(AuthContext)
    const navigate = useNavigate()

    // 🔒 Redirección automática si ya está autenticado
    useEffect(() => {
        if (user) {
            navigate("/paginaPrincipal")
        }
    }, [user, navigate])

    const onSubmit = async (data) => {
        const success = await login(data)
        if (success) {
            navigate("/paginaPrincipal")
        }
    }

    return (
        <div className="min-h-screen flex bg-blue-100">

            <ToastContainer />

            {/* Imagen de fondo */}
            <div className="hidden md:flex w-1/2 relative">

                {/* Fondo */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/login.jfif')" }}
                ></div>

                {/* Capa azul institucional translúcida */}
                <div className="absolute inset-0 bg-blue-900/70"></div>

            </div>

            {/*
            <div className="hidden md:flex w-1/2 bg-blue-900 text-white flex-col justify-center items-center px-10">

                <img
                    src="/images/epn.png"
                    alt="Logo Universidad"
                    className="w-32 mb-6"
                />

                <h2 className="text-3xl font-bold text-center">
                    Sistema Académico
                </h2>

                <p className="mt-4 text-center text-blue-200">
                    Plataforma oficial para gestión de matrículas y materias
                </p>

                <div className="mt-10 border-t border-blue-700 w-3/4"></div>

                <p className="mt-6 text-sm text-blue-300 text-center">
                    Escuela Politécnica Nacional
                </p>

            </div>
            */}


            {/* Formulario */}

                <div className="flex w-full md:w-1/2 items-center justify-center">

                    {/*Tamaño 500*/}
                    {/*<div className="bg-white p-12 w-4/5 max-w-xl min-h-[500px] shadow-lg rounded-xl">*/}
                    {/*Tamaño 600*/}
                    {/*<div className="bg-white p-12 w-4/5 max-w-xl min-h-[560px] shadow-lg rounded-xl flex flex-col gap-3">*/}
                    {/*Formulario traslucido*/}
                    <div className="bg-white/30 backdrop-blur-md 
                p-12 w-4/5 max-w-xl min-h-[560px] 
                shadow-2xl rounded-2xl 
                border border-white/40 
                flex flex-col gap-3">

                        <h1 className="text-2xl font-semibold text-center text-gray-800">
                            Iniciar Sesión
                        </h1>

                        <p className="text-gray-500 text-center mt-2 mb-6">
                            Acceso exclusivo para estudiantes
                        </p>

                        <form className="flex flex-col gap-7" onSubmit={handleSubmit(onSubmit)}>

                            {/* Email */}
                            <div className="flex flex-col gap-3">
                                <label className="block text-base font-medium text-gray-700 mb-1">
                                    Correo institucional
                                </label>

                                <input
                                    type="email"
                                    placeholder="usuario@epn.edu.ec"
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-800 outline-none"
                                    {...register("email", {
                                        required: "El correo es obligatorio"
                                    })}
                                />

                                {errors.email && (
                                    <p className="text-red-600 text-base mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-3">
                                <label className="block text-base font-medium text-gray-700 mb-1">
                                    Contraseña
                                </label>

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="************"
                                        className="w-full px-3 py-2 border border-gray-300 rounded pr-10 focus:ring-2 focus:ring-blue-800 outline-none"
                                        {...register("password", {
                                            required: "La contraseña es obligatoria"
                                        })}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-gray-500"
                                    >
                                        {showPassword
                                            ? <MdVisibilityOff size={20} />
                                            : <MdVisibility size={20} />
                                        }
                                    </button>
                                </div>

                                {errors.password && (
                                    <p className="text-red-600 text-base mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Botón */}
                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-900 text-white rounded hover:bg-blue-700 transition"
                            >
                                Acceder al sistema
                            </button>

                            {/* 🔗 Enlace a Register */}
                            <p className="text-center text-sm text-gray-600 mt-4">
                                ¿No tienes cuenta?{" "}
                                <span
                                    onClick={() => navigate("/register")}
                                    className="text-blue-900 font-semibold cursor-pointer hover:underline"
                                >
                                    Regístrate aquí
                                </span>
                            </p>

                        </form>

                        <div className="mt-6 text-center text-sm text-gray-500">
                            © 2026 Sistema Académico Institucional
                        </div>

                    </div>
                </div>

            </div>
            )
}

export default Login