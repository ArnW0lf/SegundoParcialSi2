//Muestra un producto dentro del carrito:
//src\components\customer\CartItem.jsx
export default function CartItem({ item, onRemove }) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-3">
        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
        <div>
          <h4 className="font-semibold">{item.name}</h4>
          <p className="text-gray-500">${item.price} x {item.quantity}</p>
        </div>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="text-red-500 hover:text-red-700 text-sm"
      >
        Eliminar
      </button>
    </div>
  );
}

