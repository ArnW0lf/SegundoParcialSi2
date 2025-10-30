// src/components/layout/CustomerLayout.jsx
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function CustomerLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4">{children}</main>
      
      <Footer />
    </div>
  );
}
