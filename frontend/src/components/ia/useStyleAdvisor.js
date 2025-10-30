//Hook que maneja la lógica de Gemini
//src/components/ia/useStyleAdvisor.js
import { useState } from "react";
import { callGeminiAPI } from "../../services/geminiService";

export function useStyleAdvisor() {
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);

  const getStyleAdvice = async (carrito) => {
    if (!carrito || carrito.length === 0) {
      setRecommendation("Agrega artículos al carrito para obtener un consejo.");
      return;
    }

    setLoading(true);
    setRecommendation("");

    const itemNames = carrito.map(i => `${i.cantidad} x ${i.nombre}`).join(", ");
    const systemPrompt = "Eres un estilista personal y asesor de moda.";
    const userQuery = `Mi carrito contiene: ${itemNames}. Dame un consejo de estilo breve (2-3 oraciones).`;

    try {
      const text = await callGeminiAPI(userQuery, systemPrompt);
      setRecommendation(text);
    } catch (err) {
      setRecommendation("No se pudo generar el consejo. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return { recommendation, loading, getStyleAdvice };
}
