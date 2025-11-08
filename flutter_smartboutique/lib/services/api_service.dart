import 'dart:convert';
import 'package:flutter/foundation.dart' hide Category; // Para debug print
import 'package:http/http.dart' as http;
import '../models/product.dart'; // Asegúrate de que esta ruta sea correcta
import '../models/venta.dart';
import '../providers/cart_provider.dart'; // Para la clase CartItem

// --- IMPORTANTE: Configuración de la IP del Backend ---
// Emulador de Android: 'http://10.0.2.2:8000/api'
// Dispositivo Físico (ejemplo): 'http://192.168.1.100:8000/api'
// iOS (simulador): 'http://127.0.0.1:8000/api'
//---------------------------------------------------------
const String _baseUrl = 'http://192.168.0.6:8000/api';

class ApiService {
  // --- Productos y Categorías ---

  Future<List<Product>> getProducts() async {
    try {
      final response = await http.get(Uri.parse('$_baseUrl/productos/'));
      if (response.statusCode == 200) {
        // Decodificar la respuesta usando UTF-8 para manejar tildes y caracteres especiales
        final List<dynamic> data = json.decode(utf8.decode(response.bodyBytes));
        return data.map((item) => Product.fromJson(item)).toList();
      } else {
        throw Exception(
          'Error al cargar productos (Código: ${response.statusCode})',
        );
      }
    } catch (e) {
      debugPrint("Error en getProducts: $e");
      throw Exception('Error de conexión al obtener productos: $e');
    }
  }

  Future<List<Category>> getCategories() async {
    try {
      final response = await http.get(Uri.parse('$_baseUrl/categorias/'));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(utf8.decode(response.bodyBytes));
        return data.map((item) => Category.fromJson(item)).toList();
      } else {
        throw Exception(
          'Error al cargar categorías (Código: ${response.statusCode})',
        );
      }
    } catch (e) {
      debugPrint("Error en getCategories: $e");
      throw Exception('Error de conexión al obtener categorías: $e');
    }
  }

  // --- Clientes (Login y Registro) ---

  /// Intenta iniciar sesión buscando un cliente por email.
  /// Devuelve el Map del cliente si lo encuentra.
  Future<Map<String, dynamic>?> loginClient(String email) async {
    try {
      final response = await http.get(Uri.parse('$_baseUrl/clientes/'));
      if (response.statusCode == 200) {
        final List<dynamic> clientes = json.decode(
          utf8.decode(response.bodyBytes),
        );
        // Busca el cliente en la lista
        for (var cliente in clientes) {
          if (cliente['email'] != null &&
              cliente['email'].toString().toLowerCase() ==
                  email.toLowerCase()) {
            return cliente; // Devuelve el Map del cliente encontrado
          }
        }
        return null; // No se encontró el cliente
      } else {
        throw Exception('Error al conectar con el servidor.');
      }
    } catch (e) {
      debugPrint("Error en loginClient: $e");
      throw Exception('Error de conexión: $e');
    }
  }

  /// Registra un nuevo cliente.
  /// Devuelve el Map del cliente si se crea exitosamente.
  Future<Map<String, dynamic>?> registerClient(
    String nombre,
    String email,
  ) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/clientes/'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{'nombre': nombre, 'email': email}),
    );

    if (response.statusCode == 201) {
      // 201 Created
      final data = json.decode(utf8.decode(response.bodyBytes));
      return data; // Devuelve el Map del nuevo cliente
    } else {
      // Manejo de errores (ej. email duplicado)
      final error = json.decode(utf8.decode(response.bodyBytes));
      debugPrint("Error en registerClient: $error");
      throw Exception('Error al registrar: ${error.toString()}');
    }
  }

  // --- Ventas ---

  /// Envía la orden de venta al backend.
  Future<bool> createVenta(int clienteId, Map<int, CartItem> cartItems) async {
    final ventaData = {
      'cliente_id': clienteId,
      'metodo_pago': 'PAYPAL', // Puedes cambiar esto si es necesario
      'detalles': cartItems.values
          .map(
            (item) => {
              'producto_id': item.product.id,
              'cantidad': item.cantidad,
            },
          )
          .toList(),
    };

    final response = await http.post(
      Uri.parse('$_baseUrl/ventas/crear/'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(ventaData),
    );

    if (response.statusCode == 201) {
      return true; // Venta creada exitosamente
    } else {
      final error = json.decode(utf8.decode(response.bodyBytes));
      debugPrint("Error en createVenta: $error");
      throw Exception('Error al crear la venta: ${error.toString()}');
    }
  }

  Future<List<Venta>> getSales() async {
    try {
      final response = await http.get(Uri.parse('$_baseUrl/ventas/'));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(utf8.decode(response.bodyBytes));
        // Mapea la lista de JSON a una lista de objetos Venta
        return data.map((item) => Venta.fromJson(item)).toList();
      } else {
        throw Exception('Error al cargar el historial de ventas (Código: ${response.statusCode})');
      }
    } catch (e) {
      debugPrint("Error en getSales: $e");
      throw Exception('Error de conexión al obtener ventas: $e');
    }
  }

}
