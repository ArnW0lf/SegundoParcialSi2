
// src/components/layout/Footer.jsx
import facebookIcon from "../../assets/icons/face.png";
import instagramIcon from "../../assets/icons/insta.png";
import tiktokIcon from "../../assets/icons/whatsapp.png";

import visaIcon from "../../assets/icons/visa.png";
import mastercardIcon from "../../assets/icons/visa.png";
import paypalIcon from "../../assets/icons/visa.png";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 pt-10 pb-6">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Branding y contacto */}
        <div className="flex flex-col space-y-3">
          <h2 className="text-2xl font-bold text-white">Smart Boutique</h2>
          <p className="text-gray-400">La moda inteligente a tu alcance. Explora nuestra colección y encuentra tu estilo.</p>
          <p className="text-gray-400">📍 Calle Ejemplo 123, Santa Cruz - Bolivia</p>
          <p className="text-gray-400">📞 +591 76815903</p>
          <p className="text-gray-400">✉ support@smartboutique.com</p>
        </div>

        {/* Enlaces rápidos */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-xl font-semibold text-white">Enlaces rápidos</h3>
          <a href="/" className="hover:text-pink-400 transition">Inicio</a>
          <a href="/shop" className="hover:text-pink-400 transition">Tienda</a>
          <a href="/about" className="hover:text-pink-400 transition">Acerca de</a>
          <a href="/contact" className="hover:text-pink-400 transition">Contacto</a>
          <a href="/terms" className="hover:text-pink-400 transition">Términos y condiciones</a>
          <a href="/privacy" className="hover:text-pink-400 transition">Política de privacidad</a>
        </div>

        {/*  Newsletter */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-xl font-semibold text-white">Suscríbete</h3>
          <p className="text-gray-400">Recibe promociones y novedades en tu correo.</p>
          <div className="flex mt-2">
            <input 
              type="email" 
              placeholder="Tu correo electrónico" 
              className="px-3 py-2 rounded-l-lg w-full focus:outline-none text-gray-900"
            />
            <button className="bg-pink-500 px-4 py-2 rounded-r-lg text-white hover:bg-pink-600 transition">
              Suscribirse
            </button>
          </div>
        </div>

        {/* Redes sociales + métodos de pago */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold text-white">Síguenos</h3>
          <div className="flex space-x-4 mt-2">
            <a href="https://facebook.com" target="_blank">
              <img src={facebookIcon} alt="Facebook" className="w-8 h-8 hover:opacity-80 transition rounded-full" />
            </a>
            <a href="https://instagram.com" target="_blank">
              <img src={instagramIcon} alt="Instagram" className="w-8 h-8 hover:opacity-80 transition rounded-full" />
            </a>
            <a href="https://tiktok.com" target="_blank">
              <img src={tiktokIcon} alt="Tiktok" className="w-8 h-8 hover:opacity-80 transition rounded-full" />
            </a>
          </div>

          <h3 className="text-xl font-semibold text-white">Métodos de pago</h3>
          <div className="flex space-x-4 mt-2">
            <img src={visaIcon} alt="Visa" className="w-12 h-8" />
            <img src={mastercardIcon} alt="Mastercard" className="w-12 h-8" />
            <img src={paypalIcon} alt="Paypal" className="w-12 h-8" />
          </div>
        </div>

      </div>

      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
        © 2025 Smart Boutique. Todos los derechos reservados.  
        <br />
        “Moda inteligente para cada estilo”
      </div>
    </footer>
  );
}
