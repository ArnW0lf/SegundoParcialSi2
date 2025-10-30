// src/components/layout/Header.jsx
/*import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow">
      <h1 className="text-2xl font-bold">Smart Boutique</h1>
      <nav className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/shop" className="hover:underline">Shop</Link>
        <Link to="/cart" className="hover:underline">Cart</Link>
        <Link to="/profile" className="hover:underline">Profile</Link>
      </nav>
    </header>
  );
}*/
// src/components/layout/Header.jsx
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu } from "lucide-react"; // iconos modernos
import Logo from "../../assets/logosb.jpg";
import UserMenu from "./UserMenu"; // menu desplegable de usuario

import CartMenu from "./CartMenu";// carrito en el header



export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  //carrito de compras en el header prueba
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Vestido Floral", price: 120, quantity: 2, image: "/src/assets/images/vestido1.jpg" },
    { id: 2, name: "Camisa Casual", price: 90, quantity: 1, image: "/src/assets/images/camisa1.jpg" },
  ]);
  const handleRemoveFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <>
      <header className="bg-gray-100 shadow-md p-3 md:p-4 flex items-center justify-between sticky top-0 z-50">
        {/* 🔹 Logo + Nombre */}
        <div className="flex items-center space-x-2">
            <img src={Logo} alt="Logo" className="w-20 h-20 rounded-full object-cover" />
          <h1 className="text-xl md:text-2xl font-bold text-black-600">
            Smart Boutique
          </h1>
        </div>

        {/* 🔍 Buscador */}
        <div className="hidden md:flex flex-1 mx-6">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 🛒 Íconos de acción */}
        <div className="flex items-center space-x-4">

          

          
          { /** Carrito en el header */}
          <CartMenu cartItems={cartItems} onRemove={handleRemoveFromCart} />
          
          {/* Menú desplegable de Usuario */}
          <UserMenu />
          

          {/* Botón Menú (solo móvil) */}
          <button
            className="md:bloc flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={toggleSidebar}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>
      
      
      
    </>
  );
}


