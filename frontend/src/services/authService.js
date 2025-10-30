// src/services/authService.js
// src/services/authService.js

export async function fakeLogin(email, password) {
  // Simulación de un "delay" como si fuera una llamada real al servidor
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Usuarios simulados
  const users = [
    {
      email: "admin@gmail.com",
      password: "1234",
      role: "admin",
      name: "Administrador",
    },
    {
      email: "cliente@gmail.com",
      password: "1234",
      role: "cliente",
      name: "Cliente Ejemplo",
    },
  ];

  // Buscar el usuario
  const foundUser = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!foundUser) {
    throw new Error("Correo o contraseña incorrectos");
  }

  return foundUser;
}
