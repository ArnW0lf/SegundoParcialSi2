//src/components/admin/AdminSidebar.jsx
import { useState } from "react";
import { LayoutDashboard, Package, Users, FileBarChart, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminSidebar() {
  const [openMenu, setOpenMenu] = useState(true);

  return (
    <aside className="bg-gray-900 text-white w-64 h-screen p-4 flex flex-col transition-all duration-300">
      <button
        className="flex items-center justify-between w-full text-left mb-6 font-semibold"
        onClick={() => setOpenMenu(!openMenu)}
      >
        Menú principal
        <ChevronDown className={`transform transition-transform ${openMenu ? "rotate-180" : ""}`} />
      </button>

      {openMenu && (
        <ul className="flex flex-col gap-3">
          <li>
            <Link to="/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/products" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
              <Package size={20} />
              Productos
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
              <Users size={20} />
              Usuarios
            </Link>
          </li>
          <li>
            <Link to="/admin/reports" className="flex items-center gap-2 p-2 rounded hover:bg-gray-800">
              <FileBarChart size={20} />
              Reportes
            </Link>
          </li>
        </ul>
      )}
    </aside>
  );
}
