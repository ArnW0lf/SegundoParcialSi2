//Componente que muestra el botón y la recomendación
//src/components/ia/GeminiAdvisor.jsx

import React from "react";
import { useStyleAdvisor } from "./useStyleAdvisor";

export default function GeminiAdvisor({ carrito }) {
  const { recommendation, loading, getStyleAdvice } = useStyleAdvisor();

  return (
    <div className="gemini-advisor">
      <button
        onClick={() => getStyleAdvice(carrito)}
        disabled={loading || carrito.length === 0}
        className="gemini-button"
      >
        {loading ? "Pensando..." : "✨ Asesor de Estilo IA"}
      </button>

      {recommendation && !loading && (
        <div className="gemini-recommendation">
          <p>{recommendation}</p>
        </div>
      )}
    </div>
  );
}

/* usaaaaaaaar
import GeminiAdvisor from "../ia/GeminiAdvisor";

// dentro del render
<GeminiAdvisor carrito={cartItems} />
*/