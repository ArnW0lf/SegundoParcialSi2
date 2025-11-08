import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/user_provider.dart';
import '../services/api_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

// Define los modos de vista
enum AuthMode { login, register }

class _ProfileScreenState extends State<ProfileScreen> {
  final ApiService _apiService = ApiService();
  final _emailController = TextEditingController();
  final _nombreController = TextEditingController(); // Nuevo controlador para el nombre
  
  AuthMode _authMode = AuthMode.login; // Modo inicial
  String _errorMessage = '';
  bool _isLoading = false;

  @override
  void dispose() {
    _emailController.dispose();
    _nombreController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_emailController.text.isEmpty) {
      setState(() => _errorMessage = 'Por favor, ingresa un email.');
      return;
    }
    
    // Validar nombre si está en modo registro
    if (_authMode == AuthMode.register && _nombreController.text.isEmpty) {
      setState(() => _errorMessage = 'Por favor, ingresa tu nombre.');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    final userProvider = Provider.of<UserProvider>(context, listen: false);

    try {
      Map<String, dynamic>? clienteData;
      String clienteEmail = _emailController.text.trim();
      String clienteNombre = _nombreController.text.trim();

      if (_authMode == AuthMode.login) {
        // --- Lógica de Login ---
        clienteData = await _apiService.loginClient(clienteEmail);
        if (clienteData != null) {
          // Llama al provider con los 3 argumentos correctos
          userProvider.login(
            clienteData['id'], 
            clienteData['nombre'], 
            clienteData['email']
          ); 
        } else {
          setState(() => _errorMessage = 'Email no encontrado. ¿Quieres registrarte?');
        }
      } else {
        // --- Lógica de Registro ---
        clienteData = await _apiService.registerClient(clienteNombre, clienteEmail);
        if (clienteData != null) {
          userProvider.login(
            clienteData['id'], 
            clienteData['nombre'], 
            clienteData['email']
          );
        } else {
          setState(() => _errorMessage = 'No se pudo completar el registro.');
        }
      }
    } catch (e) {
      setState(() => _errorMessage = e.toString().replaceFirst("Exception: ", ""));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  // Cambia entre modo Login y Registro
  void _switchAuthMode() {
    setState(() {
      _authMode = _authMode == AuthMode.login ? AuthMode.register : AuthMode.login;
      _errorMessage = '';
    });
  }

  @override
  Widget build(BuildContext context) {
    // Escucha al UserProvider para saber si el usuario ya está logueado
    final userProvider = Provider.of<UserProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mi Perfil'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: userProvider.isLoggedIn
            ? _buildProfileView(userProvider) // Muestra perfil si está logueado
            : _buildAuthForm(), // Muestra formulario si no
      ),
    );
  }

  // --- Widget para el Formulario de Autenticación (Login/Registro) ---
  Widget _buildAuthForm() {
    return SingleChildScrollView(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            _authMode == AuthMode.login ? 'Iniciar Sesión' : 'Registrarse',
            style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 30),
          
          // --- Campo de Nombre (solo en modo Registro) ---
          if (_authMode == AuthMode.register)
            TextField(
              controller: _nombreController,
              decoration: const InputDecoration(
                labelText: 'Nombre Completo',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.person),
              ),
              keyboardType: TextInputType.name,
            ),
          
          if (_authMode == AuthMode.register)
            const SizedBox(height: 20),

          // --- Campo de Email ---
          TextField(
            controller: _emailController,
            decoration: const InputDecoration(
              labelText: 'Email',
              border: OutlineInputBorder(),
              prefixIcon: Icon(Icons.email),
            ),
            keyboardType: TextInputType.emailAddress,
          ),
          const SizedBox(height: 30),

          // --- Mensaje de Error ---
          if (_errorMessage.isNotEmpty)
            Text(
              _errorMessage,
              style: const TextStyle(color: Colors.red),
              textAlign: TextAlign.center,
            ),
          if (_errorMessage.isNotEmpty)
            const SizedBox(height: 20),

          // --- Botón de Enviar ---
          _isLoading
              ? const Center(child: CircularProgressIndicator())
              : ElevatedButton(
                  onPressed: _submit,
                  child: Text(_authMode == AuthMode.login ? 'Entrar' : 'Crear Cuenta'),
                ),
          
          const SizedBox(height: 20),

          // --- Botón para Cambiar de Modo ---
          TextButton(
            onPressed: _switchAuthMode,
            child: Text(
              _authMode == AuthMode.login
                  ? '¿No tienes cuenta? Regístrate aquí'
                  : '¿Ya tienes cuenta? Inicia sesión',
              style: TextStyle(color: Theme.of(context).primaryColor),
            ),
          ),
        ],
      ),
    );
  }

  // --- Widget para la Vista de Perfil (cuando ya está logueado) ---
  Widget _buildProfileView(UserProvider userProvider) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Icon(Icons.check_circle_outline, size: 80, color: Colors.green[700]),
        const SizedBox(height: 20),
        Text(
          // Usa el getter 'clienteNombre' que sí existe
          '¡Hola, ${userProvider.clienteNombre ?? 'Usuario'}!', 
          style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 10),
        Text(
          // Usa el getter 'clienteEmail' que sí existe
          userProvider.clienteEmail ?? 'No email', 
          // CORRECCIÓN: 'Colors.grey[700]' y quitamos 'const'
          style: TextStyle(fontSize: 18, color: Colors.grey[700]), 
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 40),
        ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: Colors.red[700]),
          onPressed: () {
            userProvider.logout();
            _emailController.clear();
            _nombreController.clear();
          },
          child: const Text('Cerrar Sesión'),
        ),
      ],
    );
  }
}