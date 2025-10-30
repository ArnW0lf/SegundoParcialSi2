
// src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fakeLogin } from "../../services/authService";
import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import logo from "../../assets/logosb.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await fakeLogin(email, password);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Imagen lateral */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden lg:flex flex-1 bg-cover bg-center"
        style={{
          backgroundImage: "url('/src/assets/images/fondo.jpg')",
        }}
      ></motion.div>

      {/* Formulario */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="flex-1 flex flex-col justify-center items-center bg-gray-100 p-8 shadow-lg"
      >
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Smart Boutique" className="h-16 rounded-full shadow-md" />
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Bienvenido a Smart Boutique
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Inicia sesión para continuar
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Campo de correo */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-800" size={20} />
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Campo de contraseña */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-800" size={20} />
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Botón */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {loading ? "Ingresando..." : "Entrar"}
            </motion.button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            ¿No tienes cuenta?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Regístrate aquí
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
