import 'dart:convert';
import 'package:flutter/foundation.dart';

// --- VentaProducto (Corregido) ---
class VentaProducto {
  final int id;
  final String nombre;
  final String descripcion;
  final double precio;
  final int stock;
  final String categoria; // Sigue siendo String, pero lo extraemos del Map
  final String imagenUrl; // <-- ¡AÑADIDO!

  VentaProducto({
    required this.id,
    required this.nombre,
    required this.descripcion,
    required this.precio,
    required this.stock,
    required this.categoria,
    required this.imagenUrl, // <-- ¡AÑADIDO!
  });

  factory VentaProducto.fromJson(Map<String, dynamic> json) {
    // --- INICIO DE LA CORRECCIÓN ---
    String categoriaNombre;
    // Verificamos si 'categoria' es un Map (como en tu log)
    if (json['categoria'] is Map<String, dynamic>) {
      categoriaNombre = json['categoria']['nombre'] ?? 'Sin Categoría';
    } else {
      // Fallback por si acaso
      categoriaNombre = json['categoria']?.toString() ?? 'Sin Categoría';
    }
    // --- FIN DE LA CORRECCIÓN ---

    return VentaProducto(
      id: json['id'],
      nombre: json['nombre'],
      descripcion: json['descripcion'],
      precio: double.tryParse(json['precio'].toString()) ?? 0.0,
      stock: json['stock'],
      categoria: categoriaNombre, // <-- CORREGIDO
      imagenUrl: json['imagen_url'] ?? 'https://placehold.co/100', // <-- ¡AÑADIDO!
    );
  }
}

// --- VentaCliente (Sin cambios) ---
class VentaCliente {
  final int id;
  final String nombre;
  final String email;

  VentaCliente({required this.id, required this.nombre, required this.email});

  factory VentaCliente.fromJson(Map<String, dynamic> json) {
    return VentaCliente(
      id: json['id'],
      nombre: json['nombre'],
      email: json['email'],
    );
  }
}

// --- DetalleVenta (Sin cambios) ---
class DetalleVenta {
  final VentaProducto producto;
  final int cantidad;
  final double precioUnitario;
  final double subtotal;

  DetalleVenta({
    required this.producto,
    required this.cantidad,
    required this.precioUnitario,
    required this.subtotal,
  });

  factory DetalleVenta.fromJson(Map<String, dynamic> json) {
    return DetalleVenta(
      producto: VentaProducto.fromJson(json['producto']),
      cantidad: json['cantidad'],
      precioUnitario: double.tryParse(json['precio_unitario'].toString()) ?? 0.0,
      subtotal: double.tryParse(json['subtotal'].toString()) ?? 0.0,
    );
  }
}

// --- Venta (Sin cambios) ---
class Venta {
  final String id; // Es un UUID en Django, así que es String
  final VentaCliente cliente;
  final DateTime fechaVenta;
  final double montoTotal;
  final String estado;
  final String metodoPago;
  final List<DetalleVenta> detalles;

  Venta({
    required this.id,
    required this.cliente,
    required this.fechaVenta,
    required this.montoTotal,
    required this.estado,
    required this.metodoPago,
    required this.detalles,
  });

  factory Venta.fromJson(Map<String, dynamic> json) {
    try {
      var detallesList = json['detalles'] as List;
      List<DetalleVenta> detalles = detallesList.map((i) => DetalleVenta.fromJson(i)).toList();

      return Venta(
        id: json['id'],
        cliente: VentaCliente.fromJson(json['cliente']),
        fechaVenta: DateTime.parse(json['fecha_venta']),
        montoTotal: double.tryParse(json['monto_total'].toString()) ?? 0.0,
        estado: json['estado'],
        metodoPago: json['metodo_pago'],
        detalles: detalles,
      );
    } catch (e) {
      debugPrint("Error parseando Venta.json: $json");
      debugPrint("Error: $e");
      throw Exception('Error al parsear el objeto Venta: $e');
    }
  }
}