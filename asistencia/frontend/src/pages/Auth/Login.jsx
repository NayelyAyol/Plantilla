import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context/AuthContext";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { ToastContainer } from "react-toastify";

const Login = () => {
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    // 🔒 Redirección automática si ya está autenticado
    useEffect(() => {
        if (user) navigate("/home");
    }, [user, navigate]);

    const onSubmit = async (data) => {
        const success = await login(data);
        if (success) navigate("/home");
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">

            <ToastContainer />

            {/* Imagen de fondo */}
            <div className="hidden md:flex w-1/2 relative">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/login.jfif')" }}
                />
                <div className="absolute inset-0 bg-rose-900/70" />
            </div>

            {/* Formulario */}
            <div className="flex w-full md:w-1/2 items-center justify-center p-4">
                <div className="bg-white/30 backdrop-blur-md p-12 w-4/5 max-w-xl min-h-[560px] shadow-2xl rounded-2xl border border-white/40 flex flex-col gap-6">

                    <h1 className="text-3xl font-semibold text-center text-rose-600">
                        Iniciar Sesión
                    </h1>
                    <p className="text-center text-gray-600">
                        Acceso al sistema de reservas
                    </p>

                    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>

                        {/* Email */}
                        <div className="flex flex-col gap-1">
                            <label className="text-gray-700 font-medium">Correo electrónico</label>
                            <input
                                type="email"
                                placeholder="usuario@ejemplo.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-rose-400 outline-none"
                                {...register("email", { required: "El correo es obligatorio" })}
                            />
                            {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1 relative">
                            <label className="text-gray-700 font-medium">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="************"
                                    className="w-full px-4 py-2 border border-gray-300 rounded pr-10 focus:ring-2 focus:ring-rose-400 outline-none"
                                    {...register("password", { required: "La contraseña es obligatoria" })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                >
                                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                                </button>
                            </div>
                        </div>



                            {/* Botón */}
                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-semibold rounded-xl shadow-md hover:from-rose-600 hover:to-orange-600 transition"
                            >
                                Acceder
                            </button>

                    </form>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        ¿No tienes cuenta?{" "}
                        <span
                            onClick={() => navigate("/register")}
                            className="text-rose-600 font-semibold cursor-pointer hover:underline"
                        >
                            Regístrate aquí
                        </span>
                    </p>

                    <div className="text-center text-xs text-gray-500 mt-auto">
                        © 2026 Sistema de Reservas
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;