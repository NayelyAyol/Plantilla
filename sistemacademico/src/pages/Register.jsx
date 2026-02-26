import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFetch } from "../hooks/useFetch";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const Register = () => {
    const navigate = useNavigate();
    const fetchData = useFetch();

    const [form, setForm] = useState({
        nombre: "",
        email: "",
        password: "",
        confirmarPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validarFormulario = () => {
        const newErrors = {};
        const { nombre, email, password, confirmarPassword } = form;

        if (!nombre.trim())
            newErrors.nombre = "El nombre es obligatorio";
        else if (nombre.trim().length < 3)
            newErrors.nombre = "Debe tener al menos 3 caracteres";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim())
            newErrors.email = "El email es obligatorio";
        else if (!emailRegex.test(email))
            newErrors.email = "Ingrese un email válido";

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

        if (!password)
            newErrors.password = "La contraseña es obligatoria";
        else if (!passwordRegex.test(password))
            newErrors.password =
                "Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo";

        if (!confirmarPassword)
            newErrors.confirmarPassword = "Confirme la contraseña";
        else if (password !== confirmarPassword)
            newErrors.confirmarPassword = "Las contraseñas no coinciden";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        try {
            setLoading(true);

            const res = await fetchData(
                "/auth/register",
                {
                    nombre: form.nombre,
                    email: form.email,
                    password: form.password,
                },
                "POST"
            );

            if (res) {
                toast.success(res.msg || res.message || "Usuario registrado correctamente");
                setTimeout(() => navigate("/"), 1200);
            } else {
                toast.error("No se pudo registrar el usuario");
            }
        } catch (error) {
            toast.error(error?.response?.data?.msg || "Error del servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 px-4 sm:px-6">
            <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-md md:max-w-lg">
                
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
                    Crear Cuenta
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* NOMBRE */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Nombre completo
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            className={`w-full border rounded-lg p-3 text-sm sm:text-base outline-none transition ${
                                errors.nombre ? "border-red-500" : "focus:ring-2 focus:ring-blue-500"
                            }`}
                        />
                        {errors.nombre && (
                            <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
                        )}
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className={`w-full border rounded-lg p-3 text-sm sm:text-base outline-none transition ${
                                errors.email ? "border-red-500" : "focus:ring-2 focus:ring-blue-500"
                            }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div className="relative">
                        <label className="block text-sm font-medium mb-1">
                            Contraseña
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className={`w-full border rounded-lg p-3 pr-10 text-sm sm:text-base outline-none transition ${
                                errors.password ? "border-red-500" : "focus:ring-2 focus:ring-blue-500"
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 sm:top-10 text-gray-500"
                        >
                            {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                        </button>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="relative">
                        <label className="block text-sm font-medium mb-1">
                            Confirmar Contraseña
                        </label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmarPassword"
                            value={form.confirmarPassword}
                            onChange={handleChange}
                            className={`w-full border rounded-lg p-3 pr-10 text-sm sm:text-base outline-none transition ${
                                errors.confirmarPassword
                                    ? "border-red-500"
                                    : "focus:ring-2 focus:ring-blue-500"
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-9 sm:top-10 text-gray-500"
                        >
                            {showConfirmPassword
                                ? <MdVisibilityOff size={20} />
                                : <MdVisibility size={20} />}
                        </button>
                        {errors.confirmarPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.confirmarPassword}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg text-sm sm:text-base text-white font-semibold transition ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Registrando..." : "Registrarse"}
                    </button>
                </form>

                <p className="text-center mt-4 text-sm sm:text-base text-gray-600">
                    ¿Ya tienes una cuenta?{" "}
                    <span
                        onClick={() => navigate("/")}
                        className="text-blue-600 font-semibold cursor-pointer hover:underline"
                    >
                        Iniciar sesión
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;