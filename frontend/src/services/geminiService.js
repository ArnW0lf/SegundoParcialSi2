// Función callGeminiAPI
//src/services/geminiService.js
const GEMINI_API_KEY = ""; 
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

export async function callGeminiAPI(userQuery, systemPrompt = "") {
  const payload = {
    contents: [{ parts: [{ text: userQuery }] }]
  };

  if (systemPrompt) {
    payload.systemInstruction = { parts: [{ text: systemPrompt }] };
  }

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`Error Gemini: ${response.statusText}`);

    const result = await response.json();
    const candidate = result.candidates?.[0];
    return candidate?.content?.parts?.[0]?.text || "Respuesta vacía de Gemini";
  } catch (err) {
    console.error(err);
    throw err;
  }
}
