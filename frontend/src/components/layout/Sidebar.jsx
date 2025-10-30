// src/components/layout/Sidebar.jsx
/*import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 p-4 hidden md:block">
      <nav className="flex flex-col space-y-2">
        <Link to="/" className="hover:bg-gray-200 p-2 rounded">Home</Link>
        <Link to="/shop" className="hover:bg-gray-200 p-2 rounded">Shop</Link>
        <Link to="/cart" className="hover:bg-gray-200 p-2 rounded">Cart</Link>
        <Link to="/profile" className="hover:bg-gray-200 p-2 rounded">Profile</Link>
      </nav>
    </aside>
  );
}*/
// src/components/layout/Sidebar.jsx
// src/components/layout/Sidebar.jsx
import { Link } from "react-router-dom";

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      {/* Fondo oscuro */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity ${
          isOpen ? "opacity-30 block" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar off-canvas desde la derecha */}
      <aside
        className={`fixed top-0 right-0 w-64 h-full z-50 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          bg-linear-to-b from-gray-600 to-slate-500 text-white shadow-lg`}
      >
        <div className="p-4 flex justify-between items-center border-b border-blue-400">
          <h2 className="text-xl font-bold">Menú</h2>
          <button
            onClick={toggleSidebar}
            className="text-white text-2xl font-bold hover:text-gray-200 transition"
          >
            &times;
          </button>
        </div>
        <nav className="flex flex-col mt-4 space-y-2 px-4">
          <Link to="/" className="hover:bg-blue-500 p-2 rounded transition">Home</Link>
          <Link to="/shop" className="hover:bg-blue-500 p-2 rounded transition">Shop</Link>
          <Link to="/cart" className="hover:bg-blue-500 p-2 rounded transition">Cart</Link>
          <Link to="/profile" className="hover:bg-blue-500 p-2 rounded transition">Profile</Link>
        </nav>
      </aside>
    </>
  );
}


