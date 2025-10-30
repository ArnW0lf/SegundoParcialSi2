import AdminLayout from "../../components/admin/AdminLayout";
import { UserPlus, Edit, Trash } from "lucide-react";

export default function Users() {
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <button className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          <UserPlus className="w-5 h-5 mr-2" /> Nuevo Usuario
        </button>
      </div>

      <table className="w-full bg-white shadow rounded-xl">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-left">Correo</th>
            <th className="p-3 text-left">Rol</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {[
            { id: 1, name: "Ana Pérez", email: "ana@boutique.com", role: "Admin" },
            { id: 2, name: "Luis Gómez", email: "luis@boutique.com", role: "Cliente" },
          ].map((u) => (
            <tr key={u.id} className="border-t hover:bg-gray-50">
              <td className="p-3">#{u.id}</td>
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.role}</td>
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
