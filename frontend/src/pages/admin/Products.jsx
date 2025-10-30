//src/pages/admin/Products.jsx

import AdminLayout from "../../components/admin/AdminLayout";
import { PlusCircle, Edit, Trash } from "lucide-react";

export default function Products() {
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          <PlusCircle className="w-5 h-5 mr-2" /> Nuevo Producto
        </button>
      </div>

      <table className="w-full bg-white shadow rounded-xl">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Precio</th>
            <th className="p-3 text-left">Stock</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((id) => (
            <tr key={id} className="border-t hover:bg-gray-50">
              <td className="p-3">#{id}</td>
              <td className="p-3">Producto {id}</td>
              <td className="p-3">$ {(id * 10).toFixed(2)}</td>
              <td className="p-3">{id * 5}</td>
              <td className="p-3 flex space-x-3">
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit className="w-5 h-5" />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <Trash className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
