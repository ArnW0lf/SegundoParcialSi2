//Formulario para completar la compra (nombre, dirección, método de pago, etc.):
//src\components\customer\CheckoutForm.jsx
export default function CheckoutForm({ onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-700">Finalizar compra</h2>
      <input
        type="text"
        placeholder="Nombre completo"
        className="w-full border px-3 py-2 rounded-lg"
        required
      />
      <input
        type="text"
        placeholder="Dirección"
        className="w-full border px-3 py-2 rounded-lg"
        required
      />
      <select className="w-full border px-3 py-2 rounded-lg">
        <option>Tarjeta de crédito</option>
        <option>Transferencia bancaria</option>
        <option>Pago contra entrega</option>
      </select>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Confirmar compra
      </button>
    </form>
  );
}
