// src/components/customer/CartMenu.jsx
// src/components/layout/CartMenu.jsx
import { useState } from "react";
import { ShoppingCart, X } from "lucide-react";
import CartItem from "../customer/CartItem";
import { Link } from "react-router-dom";

export default function CartMenu({ cartItems = [], onRemove }) {
  const [open, setOpen] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="relative">
      {/* Botón del carrito */}
      <button
        className="flex items-center hover:text-blue-600 transition"
        onClick={() => setOpen(!open)}
      >
        <ShoppingCart className="w-6 h-6" />
        {cartItems.length > 0 && (
          <span className="ml-1 text-sm font-bold text-red-600">{cartItems.length}</span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-50">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg">Carrito</h3>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {cartItems.length === 0 && (
              <p className="p-4 text-gray-500">No hay productos en el carrito</p>
            )}
            {cartItems.map(item => (
              <CartItem key={item.id} item={item} onRemove={onRemove} />
            ))}
          </div>

          {cartItems.length > 0 && (
            <div className="p-4 border-t">
              <p className="font-semibold mb-2">Total: ${total}</p>
              <Link
                to="/checkout"
                className="block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Finalizar Compra
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
