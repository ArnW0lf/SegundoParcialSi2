//menú desplegable de perfil (dropdown)
//src/components/layout/UserMenu.jsx

//menú desplegable de perfil (dropdown)
//src/components/layout/UserMenu.jsx

import { useState, useRef, useEffect } from "react";
import {
  User,
  Package,
  Settings,
  MapPin,
  CreditCard,
  Heart,
  CalendarCheck,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  // Leer usuario simulado (login fake)
  const user = JSON.parse(localStorage.getItem("user"));
  const isLogged = !!user;

  const handleLogout = () => {
    localStorage.removeItem("user"); // Limpia la sesión simulada
    navigate("/"); // Redirige al login
    setOpen(false);
  };



  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full transition"
      >
        <User className="w-6 h-6 text-gray-700" />
        <span className="hidden md:inline font-medium text-gray-700">
          {user ? user.name || "Mi Cuenta" : "Cuenta"}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 z-50 animate-fadeIn">
          <ul className="divide-y divide-gray-100 text-gray-700">
            {!isLogged ? (
              <li>
                <Link
                  to="/login"
                  className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-700"
                  onClick={() => setOpen(false)}
                >
                  <User className="w-5 h-5 text-blue-600" /> Iniciar sesión
                </Link>
              </li>
            ) : (
              <>
                <li className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer">
                  <Package className="w-5 h-5 text-blue-600" /> Mis Pedidos
                </li>
                <li className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer">
                  <Settings className="w-5 h-5 text-blue-600" /> Ajustes de la cuenta
                </li>
                <li className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer">
                  <MapPin className="w-5 h-5 text-blue-600" /> Mi Libreta de Direcciones
                </li>
                <li className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer">
                  <CreditCard className="w-5 h-5 text-blue-600" /> Tarjeta de crédito
                </li>
                <li className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer">
                  <Heart className="w-5 h-5 text-blue-600" /> Guardados
                </li>
                <li className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer">
                  <CalendarCheck className="w-5 h-5 text-blue-600" /> Mis Citas
                </li>
                <li
                  onClick={handleLogout}
                  className="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer text-red-500 font-medium"
                >
                  <LogOut className="w-5 h-5" /> Cerrar Sesión
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}








