//
export default function Profile() {
  const user = { name: "Elias", email: "elias@smartboutique.com" };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Mi perfil</h1>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Correo:</strong> {user.email}</p>
      <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600">
        Editar perfil
      </button>
    </div>
  );
}
