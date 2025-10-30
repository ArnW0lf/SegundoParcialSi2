//src\App.jsx
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//src\App.jsx
import './App.css'
import './index.css' // asegúrate que aquí importaste Tailwind
import AppRoutes from "./routes/AppRoutes";
/* probando tailwindcss
function App() {
  return (
    
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-5xl font-bold text-blue-400">
        Tailwind está funcionando 🎉
      </h1>
      <p className="mt-4 text-lg">
        Si ves este texto con colores y centrado, ¡todo ok!
      </p>
    </div>
   

  );
} */

function App() {
  return <AppRoutes />;
}
//dirige a src/routes/AppRoutes.jsx

export default App;
