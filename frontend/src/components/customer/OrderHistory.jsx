//Muestra las compras anteriores del cliente:
//src/components/customer/OrderHistory.jsx
export default function OrderHistory({ orders }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Historial de pedidos</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">Aún no has realizado compras.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">Pedido #{order.id}</p>
                <p className="text-gray-500">{order.date}</p>
              </div>
              <p className="font-semibold text-blue-600">${order.total}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
