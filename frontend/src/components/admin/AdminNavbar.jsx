
//
import { Search, LogOut } from "lucide-react";
import logo from "../../assets/logosb.jpg";

export default function AdminNavbar({ onLogout }) {
  return (
    <nav className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3 shadow-sm sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="Smart Boutique" className="w-30 h-30 rounded-full" />
        <h1 className="text-xl font-semibold text-gray-800">Smart Boutique</h1>
      </div>

      {/* Buscador */}
      <div className="relative w-1/3">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Cerrar sesión */}
      <button
        onClick={onLogout}
        className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition"
      >
        <LogOut size={20} />
        <span>Cerrar sesión</span>
      </button>
    </nav>
  );
}
