// src/pages/admin/Dashboard.jsx
// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import AdminLayout from "../../components/admin/AdminLayout";
export default function Dashboard() {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // Simula datos de ventas (puedes reemplazar con datos reales)
    setSalesData([
      { name: "Ene", sales: 4000 },
      { name: "Feb", sales: 3000 },
      { name: "Mar", sales: 5000 },
      { name: "Abr", sales: 4200 }, 
      { name: "May", sales: 6200 },
      { name: "Jun", sales: 3900 },
    ]);
  }, []);

  return (
    <AdminLayout>
    <div className="p-8 min-h-screen bg-gray-50">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
        <p className="text-gray-500 mt-2">Bienvenido al sistema de gestión de Smart Boutique 👗</p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Ventas del mes" value="$12,450" />
        <StatCard title="Pedidos nuevos" value="132" />
        <StatCard title="Clientes activos" value="84" />
      </div>

      {/* Gráfico de ventas */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Resumen de Ventas</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#3b82f6" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla de últimos pedidos */}
      <div className="mt-8 bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Últimos Pedidos</h2>
        <RecentOrders />
      </div>
    </div>
    </AdminLayout>
  );
}

// 🧩 Tarjeta de estadísticas reutilizable
function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-semibold text-gray-800 mt-2">{value}</p>
    </div>
  );
}

// 🧾 Tabla de pedidos recientes
function RecentOrders() {
  const orders = [
    { id: 1, cliente: "María López", total: "$250", estado: "Completado" },
    { id: 2, cliente: "Juan Pérez", total: "$120", estado: "Pendiente" },
    { id: 3, cliente: "Ana Gómez", total: "$340", estado: "Completado" },
  ];

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-gray-100 text-gray-700">
          <th className="p-3">Cliente</th>
          <th className="p-3">Total</th>
          <th className="p-3">Estado</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-t hover:bg-gray-50 transition">
            <td className="p-3">{order.cliente}</td>
            <td className="p-3">{order.total}</td>
            <td className="p-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.estado === "Completado"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {order.estado}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}



