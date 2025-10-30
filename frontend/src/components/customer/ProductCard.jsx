//Muestra un producto individual (imagen, nombre, precio, botón para agregar al carrito, etc.)
// src/components/customer/ProductCard.jsx
export default function ProductCard({ product }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition duration-300">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-500 text-sm">{product.category}</p>
        <p className="text-blue-600 font-bold mt-2">${product.price}</p>
        <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          Añadir al carrito
        </button>
      </div>
    </div>
  );
}

