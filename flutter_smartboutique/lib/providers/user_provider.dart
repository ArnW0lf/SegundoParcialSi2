import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserProvider with ChangeNotifier {
  int? _clienteId;
  String? _clienteNombre;
  String? _clienteEmail;

  bool _isLoading = false;
  String? _errorMessage;

  // Getters públicos para que la UI pueda leer los datos
  bool get isLoggedIn => _clienteId != null;
  int? get clienteId => _clienteId;
  String? get clienteNombre => _clienteNombre;
  String? get clienteEmail => _clienteEmail;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  UserProvider() {
    _loadUserFromPrefs(); // Intenta cargar al usuario al iniciar la app
  }

  // Carga los datos del usuario desde la memoria del teléfono
  Future<void> _loadUserFromPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    if (prefs.containsKey('clienteId')) {
      _clienteId = prefs.getInt('clienteId');
      _clienteNombre = prefs.getString('clienteNombre');
      _clienteEmail = prefs.getString('clienteEmail');
      notifyListeners();
    }
  }

  // Inicia sesión
  Future<void> login(int clienteId, String nombre, String email) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      // Guarda los datos en el provider
      _clienteId = clienteId;
      _clienteNombre = nombre;
      _clienteEmail = email;

      // Guarda los datos en la memoria del teléfono
      final prefs = await SharedPreferences.getInstance();
      await prefs.setInt('clienteId', clienteId);
      await prefs.setString('clienteNombre', nombre);
      await prefs.setString('clienteEmail', email);

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  // Cierra sesión
  Future<void> logout() async {
    _clienteId = null;
    _clienteNombre = null;
    _clienteEmail = null;
    
    // Borra los datos de la memoria del teléfono
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('clienteId');
    await prefs.remove('clienteNombre');
    await prefs.remove('clienteEmail');
    
    notifyListeners();
  }
}