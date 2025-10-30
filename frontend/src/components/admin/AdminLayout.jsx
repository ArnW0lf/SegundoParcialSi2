
//src/components/admin/AdminLayout.jsx
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <AdminNavbar onLogout={handleLogout} />
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
