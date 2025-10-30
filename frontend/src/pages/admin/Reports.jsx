//src/pages/admin/Reports.jsx
import AdminLayout from "../../components/admin/AdminLayout";
import { FileText, Download } from "lucide-react";

export default function Reports() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Reportes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Reporte de Ventas", desc: "Últimos 30 días" },
          { title: "Reporte de Inventario", desc: "Stock actual" },
          { title: "Reporte de Usuarios", desc: "Usuarios activos" },
        ].map((r, idx) => (
          <div
            key={idx}
            className="p-6 bg-white shadow rounded-xl flex flex-col items-center text-center"
          >
            <FileText className="w-10 h-10 text-indigo-500 mb-3" />
            <h2 className="text-lg font-semibold mb-1">{r.title}</h2>
            <p className="text-gray-500 text-sm mb-4">{r.desc}</p>
            <button className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
              <Download className="w-4 h-4 mr-2" /> Descargar
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

