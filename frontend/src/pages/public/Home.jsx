
// src/pages/public/Home.jsx
import CustomerLayout from "../../components/layout/CustomerLayout";
import ProductGrid from "../../components/customer/ProductGrid";
import { Mic } from "lucide-react";
import { useState, useEffect } from "react";
//import GeminiAdvisor from "../../components/ia/GeminiAdvisor";// Importa el componente GeminiAdvisor

// Simulamos productos (luego puedes traerlos desde una API o base de datos)
const products = [
  { id: 1, name: "Vestido Floral", category: "Damas", price: 120, image: "/src/assets/images/vestido1.jpg" },
  { id: 2, name: "Camisa Casual", category: "Caballeros", price: 90, image: "/src/assets/images/camisa1.jpg" },
  { id: 3, name: "Pantalón Jeans", category: "Damas", price: 110, image: "/src/assets/images/jeans1.jpg" },
  { id: 4, name: "Zapatillas Urbanas", category: "Calzado", price: 150, image: "/src/assets/images/zapatillas1.jpg" },
  { id: 5, name: "Bolso de Cuero", category: "Accesorios", price: 200, image: "/src/assets/images/bolso1.jpg" },
];



export default function Home() {
  const handleVoiceClick = () => {
    alert("Aquí irá la funcionalidad de búsqueda por voz.");
  };


  

  return (
    <CustomerLayout>
      <div className="text-center mt-6">
        <h1 className="text-4xl font-bold text-blue-600">
          Bienvenido a Smart Boutique 👗
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Descubre las últimas tendencias en moda
        </p>
      </div>

      {/* Catálogo de productos */}
      <div className="mt-8">
        <ProductGrid products={products} />

       
      </div>

      {/* Botón flotante de búsqueda por voz */}
      <button
        onClick={handleVoiceClick}
        className="fixed bottom-6 left-6 p-4 rounded-full bg-blue-600 shadow-lg hover:bg-blue-700 transition"
        title="Buscar productos por voz"
      >
        <Mic className="w-6 h-6 text-white" />
      </button>

      
    </CustomerLayout>
  );
}
