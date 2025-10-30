//
import CartItem from "../../components/customer/CartItem";
import { useState } from "react";

export default function Cart() {
  const [items, setItems] = useState([
    { id: 1, name: "Vestido floral", price: 150, image: "/images/dress1.jpg" },
    { id: 2, name: "Camisa de lino", price: 120, image: "/images/shirt1.jpg" },
  ]);

  const handleRemove = (id) => setItems(items.filter((i) => i.id !== id));

  const total = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-semibold mb-6">Tu carrito</h1>
      {items.length === 0 ? (
        <p>Tu carrito está vacío 🛍️</p>
      ) : (
        <>
          {items.map((item) => (
            <CartItem key={item.id} item={item} onRemove={handleRemove} />
          ))}
          <div className="flex justify-between items-center mt-6 font-semibold">
            <span>Total:</span>
            <span>Bs. {total}</span>
          </div>
          <button className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-xl hover:bg-pink-600">
            Proceder al pago
          </button>
        </>
      )}
    </div>
  );
}
