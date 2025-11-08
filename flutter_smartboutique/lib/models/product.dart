import 'dart:convert';

class Category {
  final int id;
  final String nombre;

  Category({required this.id, required this.nombre});

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'],
      nombre: json['nombre'],
    );
  }
}

class Product {
  final int id;
  final String nombre;
  final String descripcion;
  final double precio;
  final int stock;
  final Category categoria;
  final String imagenUrl;

  Product({
    required this.id,
    required this.nombre,
    required this.descripcion,
    required this.precio,
    required this.stock,
    required this.categoria,
    required this.imagenUrl,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      nombre: json['nombre'],
      descripcion: json['descripcion'],
      precio: double.tryParse(json['precio'].toString()) ?? 0.0,
      stock: json['stock'],
      categoria: Category.fromJson(json['categoria']),
      // Usamos la URL de la imagen que ya agregamos al backend
      imagenUrl: json['imagen_url'] ?? 'https://placehold.co/300x300?text=Producto',
    );
  }
}

List<Product> parseProducts(String responseBody) {
  final parsed = jsonDecode(responseBody).cast<Map<String, dynamic>>();
  return parsed.map<Product>((json) => Product.fromJson(json)).toList();
}