import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
// Importamos nuestro nuevo archivo CSS
import './App.css';

// --- Configuración de la API de Django ---
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const apiService = {
  get: (endpoint) => axios.get(`${API_BASE_URL}${endpoint}/`),
  post: (endpoint, data) => axios.post(`${API_BASE_URL}${endpoint}/`, data),
};

// --- Configuración de la API de Gemini ---
const GEMINI_API_KEY = "";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

async function callGeminiAPI(userQuery, systemPrompt = "") {
  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
  };

  if (systemPrompt) {
    payload.systemInstruction = {
      parts: [{ text: systemPrompt }]
    };
  }

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Error en la API de Gemini: ${response.statusText}`);
    }

    const result = await response.json();
    const candidate = result.candidates?.[0];

    if (candidate && candidate.content?.parts?.[0]?.text) {
      return candidate.content.parts[0].text;
    } else {
      throw new Error("Respuesta de Gemini inesperada o vacía.");
    }
  } catch (error) {
    console.error("Error al llamar a Gemini:", error);
    throw error;
  }
}

// --- API de Reconocimiento de Voz ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'es-ES';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
}

// --- Componente Principal de la App ---
export default function App() {
  // --- Estados de la Aplicación ---
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Haz clic en el micrófono para agregar productos por voz');

  const [geminiRecommendation, setGeminiRecommendation] = useState('');
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);

  // --- Carga de Datos Inicial ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatusMessage('Cargando productos...');
        const [resProductos, resCategorias, resClientes] = await Promise.all([
          apiService.get('/productos'),
          apiService.get('/categorias'),
          apiService.get('/clientes')
        ]);

        setProductos(resProductos.data);
        setCategorias(resCategorias.data);
        setClientes(resClientes.data);

        if (resClientes.data.length > 0) {
          setClienteSeleccionado(resClientes.data[0].id);
        }

        setStatusMessage('Haz clic en el micrófono para agregar productos por voz');
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        setStatusMessage('Error al cargar datos. Revisa la consola.');
      }
    };
    fetchData();
  }, []);

  // --- Lógica del Carrito ---
  const productosFiltrados = useMemo(() => {
    if (!categoriaSeleccionada) {
      return productos;
    }
    return productos.filter(p => p.categoria.id === categoriaSeleccionada);
  }, [productos, categoriaSeleccionada]);

  const handleAddToCart = (producto) => {
    setCarrito(prev => {
      const itemExistente = prev.find(item => item.id === producto.id);
      if (itemExistente) {
        return prev.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    setStatusMessage(`${producto.nombre} agregado al carrito.`);
    setGeminiRecommendation('');
  };

  const handleRemoveFromCart = (productoId) => {
    setCarrito(prev => prev.filter(item => item.id !== productoId));
    setGeminiRecommendation('');
  };

  const handleUpdateQuantity = (productoId, nuevaCantidad) => {
    setGeminiRecommendation('');
    if (nuevaCantidad < 1) {
      handleRemoveFromCart(productoId);
      return;
    }
    setCarrito(prev =>
      prev.map(item =>
        item.id === productoId ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  };

  const getTotalCarrito = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0).toFixed(2);
  };

  // --- Lógica de Checkout ---
  const handleCheckout = async () => {
    if (carrito.length === 0) {
      setStatusMessage("El carrito está vacío.");
      return;
    }
    if (!clienteSeleccionado) {
      setStatusMessage("Por favor, selecciona un cliente.");
      return;
    }

    const ventaData = {
      cliente_id: clienteSeleccionado,
      metodo_pago: 'PAYPAL',
      detalles: carrito.map(item => ({
        producto_id: item.id,
        cantidad: item.cantidad
      }))
    };

    try {
      setStatusMessage("Procesando venta...");
      await apiService.post('/ventas/crear', ventaData);

      setStatusMessage("¡Venta realizada con éxito!");
      setCarrito([]);
      setIsCartOpen(false);
      setGeminiRecommendation('');

      const resProductos = await apiService.get('/productos');
      setProductos(resProductos.data);

    } catch (error) {
      console.error("Error al procesar la venta:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.detalles || error.response?.data?.detail || "Error al procesar la venta.";
      setStatusMessage(`Error: ${errorMsg}`);
    }
  };

  // --- Lógica de Reconocimiento de Voz ---
  const processVoiceCommand = (transcript) => {
    transcript = transcript.toLowerCase();
    const match = transcript.match(/(agregar|añadir|dame) (.*)/i);

    if (match && match[2]) {
      const productoNombre = match[2].trim();
      if (productoNombre) {
        const productoEncontrado = productos.find(p =>
          p.nombre.toLowerCase().includes(productoNombre)
        );

        if (productoEncontrado) {
          handleAddToCart(productoEncontrado);
        } else {
          setStatusMessage(`No se encontró el producto "${productoNombre}".`);
        }
      }
    } else {
      setStatusMessage("Comando no reconocido. Intenta 'Agregar [producto]'.");
    }
  };

  const handleListen = () => {
    if (!SpeechRecognition) {
      setStatusMessage("El reconocimiento de voz no es compatible con este navegador.");
      return;
    }
    if (isListening) {
      recognition.stop();
      return;
    }

    recognition.onstart = () => {
      setIsListening(true);
      setStatusMessage("Micrófono: Escuchando...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      processVoiceCommand(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Error de reconocimiento de voz:", event.error);
      setStatusMessage("Error en el micrófono. Intenta de nuevo.");
    };

    recognition.onend = () => {
      setIsListening(false);
      setStatusMessage("Haz clic en el micrófono para agregar productos por voz");
    };

    recognition.start();
  };

  // --- NUEVA Lógica del Asesor de Estilo Gemini ---
  const handleStyleAdvice = async () => {
    if (carrito.length === 0) {
      setGeminiRecommendation("Agrega artículos a tu carrito primero para obtener un consejo.");
      return;
    }

    setIsGeminiLoading(true);
    setGeminiRecommendation("");

    const itemNames = carrito.map(item => `${item.cantidad} x ${item.nombre}`).join(', ');

    const systemPrompt = "Eres un asistente de moda y estilista personal para una tienda de ropa. Tu tono es amigable, servicial y a la moda. No intentes vender más productos, solo ofrece consejos de estilo.";
    const userQuery = `Mi carrito de compras actual contiene: ${itemNames}. Basado en esto, dame un breve consejo de moda (2-3 oraciones) sobre cómo puedo combinar estos artículos o qué tipo de accesorio (como un cinturón, bufanda o zapatos) podría complementar mi atuendo.`;

    try {
      const text = await callGeminiAPI(userQuery, systemPrompt);
      setGeminiRecommendation(text);
    } catch (error) {
      console.error("Error al llamar a Gemini:", error);
      setGeminiRecommendation("Lo siento, no pude generar un consejo de estilo en este momento. Intenta de nuevo.");
    } finally {
      setIsGeminiLoading(false);
    }
  };


  // --- Renderizado de la UI ---
  // Usamos 'class' en lugar de 'className'
  return (
    <div class="app-container">
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        cartItemCount={carrito.reduce((count, item) => count + item.cantidad, 0)}
      />

      <main class="main-content">
        <CategoryFilter
          categorias={categorias}
          categoriaSeleccionada={categoriaSeleccionada}
          onCategoriaClick={setCategoriaSeleccionada}
        />
        <ProductGrid
          productos={productosFiltrados}
          onAddToCart={handleAddToCart}
        />
      </main>

      <Footer
        statusMessage={statusMessage}
        isListening={isListening}
        onListenClick={handleListen}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => {
          setIsCartOpen(false);
          setGeminiRecommendation('');
        }}
        cartItems={carrito}
        onRemove={handleRemoveFromCart}
        onUpdate={handleUpdateQuantity}
        onCheckout={handleCheckout}
        total={getTotalCarrito()}
        clientes={clientes}
        clienteSeleccionado={clienteSeleccionado}
        onClienteChange={setClienteSeleccionado}
        geminiRecommendation={geminiRecommendation}
        isGeminiLoading={isGeminiLoading}
        onStyleAdvice={handleStyleAdvice}
      />
    </div>
  );
}

// --- Componentes de UI ---

function Navbar({ onCartClick, cartItemCount }) {
  return (
    <nav class="navbar">
      <div class="container navbar-content">
        <h1 class="navbar-title">SmartBoutique</h1>
        <button
          onClick={onCartClick}
          class="cart-button"
          aria-label="Abrir carrito"
        >
          <svg class="cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cartItemCount > 0 && (
            <span class="cart-item-count">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}

function CategoryFilter({ categorias, categoriaSeleccionada, onCategoriaClick }) {
  return (
    <div class="category-filter">
      <button
        onClick={() => onCategoriaClick(null)}
        class={`category-button ${!categoriaSeleccionada ? 'active' : ''}`}
      >
        Todos
      </button>
      {categorias.map(cat => (
        <button
          key={cat.id}
          onClick={() => onCategoriaClick(cat.id)}
          class={`category-button ${categoriaSeleccionada === cat.id ? 'active' : ''}`}
        >
          {cat.nombre}
        </button>
      ))}
    </div>
  );
}

function ProductGrid({ productos, onAddToCart }) {
  if (productos.length === 0) {
    return <p class="product-grid-empty">No se encontraron productos.</p>;
  }
  return (
    <div class="product-grid">
      {productos.map(producto => (
        <ProductCard
          key={producto.id}
          producto={producto}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

function ProductCard({ producto, onAddToCart }) {
  return (
    <div class="product-card">
      <div class="product-image-container">
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          class="product-image"
          onError={(e) => { e.target.src = 'https://placehold.co/300x300/EBF4FF/6366F1?text=Imagen&font=Inter'; }}
        />
      </div>
      <div class="product-info">
        <div>
          <h3 class="product-name" title={producto.nombre}>{producto.nombre}</h3>
          <p class="product-category">{producto.categoria.nombre}</p>
          <p class="product-price">Bs. {producto.precio}</p>
          <p class={`product-stock ${producto.stock > 10 ? 'stock-ok' : 'stock-low'}`}>
            Stock: {producto.stock}
          </p>
        </div>
        <button
          onClick={() => onAddToCart(producto)}
          disabled={producto.stock === 0}
          class="add-to-cart-button"
        >
          {producto.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
        </button>
      </div>
    </div>
  );
}

// --- Componente CartSidebar MODIFICADO ---
function CartSidebar({
  isOpen, onClose, cartItems, onRemove, onUpdate, onCheckout, total,
  clientes, clienteSeleccionado, onClienteChange,
  geminiRecommendation, isGeminiLoading, onStyleAdvice
}) {
  return (
    <>
      <div
        class={`cart-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <div
        class={`cart-sidebar ${isOpen ? 'open' : ''}`}
      >
        <div class="cart-header">
          <h2 class="cart-title">Carrito de Compras</h2>
          <button onClick={onClose} class="cart-close-button">
            &times;
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p class="cart-empty">Tu carrito está vacío.</p>
        ) : (
          <div class="cart-items-container">
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={onRemove}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        )}

        <div class="cart-footer">
          <div class="cart-client-selector">
            <label htmlFor="cliente-select">Cliente:</label>
            <select
              id="cliente-select"
              value={clienteSeleccionado}
              onChange={(e) => onClienteChange(e.target.value)}
            >
              {clientes.length === 0 ? (
                <option value="">Cargando...</option>
              ) : (
                clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* --- NUEVO: Asesor de Estilo Gemini --- */}
          <div class="gemini-advisor">
            <button
              onClick={onStyleAdvice}
              disabled={isGeminiLoading || cartItems.length === 0}
              class="gemini-button"
            >
              {isGeminiLoading ? 'Pensando...' : '✨ Asesor de Estilo IA'}
            </button>
            {geminiRecommendation && !isGeminiLoading && (
              <div class="gemini-recommendation">
                <p>{geminiRecommendation}</p>
              </div>
            )}
          </div>
          {/* --- Fin Asesor de Estilo --- */}

          <div class="cart-total">
            <span>Total:</span>
            <span>Bs. {total}</span>
          </div>
          <button
            onClick={onCheckout}
            disabled={cartItems.length === 0 || !clienteSeleccionado}
            class="checkout-button"
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </>
  );
}

function CartItem({ item, onRemove, onUpdate }) {
  return (
    <div class="cart-item">
      <div class="cart-item-image-container">
        <img
          src={`https://placehold.co/100x100/EBF4FF/6366F1?text=${encodeURIComponent(item.nombre.split(' ')[0])}&font=Inter`}
          alt={item.nombre}
          class="cart-item-image"
        />
      </div>
      <div class_name="cart-item-details">
        <h4 class="cart-item-name" title={item.nombre}>{item.nombre}</h4>
        <p class="cart-item-price">Bs. {item.precio}</p>
        <div class="quantity-updater">
          <button onClick={() => onUpdate(item.id, item.cantidad - 1)}>-</button>
          <span>{item.cantidad}</span>
          <button onClick={() => onUpdate(item.id, item.cantidad + 1)}>+</button>
        </div>
      </div>
      <button onClick={() => onRemove(item.id)} class="cart-item-remove-button">
        Quitar
      </button>
    </div>
  );
}

function Footer({ statusMessage, isListening, onListenClick }) {
  return (
    <footer class="footer-bar">
      <div class="container footer-content">
        <p class="status-message">{statusMessage}</p>
        <button
          onClick={onListenClick}
          disabled={!SpeechRecognition}
          class={`mic-button ${isListening ? 'listening' : ''}`}
          aria-label={isListening ? 'Detener micrófono' : 'Activar micrófono'}
        >
          {isListening ? (
            <svg class="mic-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
          ) : (
            <svg class="mic-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93V17h-2v-2.07A5.002 5.002 0 013 10v-1a1 1 0 011-1h12a1 1 0 011 1v1a5.002 5.002 0 01-8 4.93z" clipRule="evenodd" /></svg>
          )}
        </button>
      </div>
    </footer>
  );
}
