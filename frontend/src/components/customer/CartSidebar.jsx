//src/components/customer/CartSidebar.jsx
//el carrito en el header 

import CartItem from "./CartItem";
import { X } from "lucide-react";

export default function CartSidebar({ isOpen, onClose, cartItems, onRemove }) {
  return (
    <>
      {/* Fondo semi-transparente */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-white z-50 shadow-lg transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">Carrito</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-700 hover:text-red-500" />
          </button>
        </div>

        {/* Lista de productos */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center mt-8">Tu carrito está vacío</p>
          ) : (
            cartItems.map(item => (
              <CartItem key={item.id} item={item} onRemove={onRemove} />
            ))
          )}
        </div>

        {/* Total y checkout */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t">
            <p className="text-lg font-semibold">
              Total: Bs. {cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}
            </p>
            <button className="w-full mt-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </>
  );
}
