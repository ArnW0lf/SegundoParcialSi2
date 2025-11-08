// Archivo: lib/screens/home_screen.dart (Limpio)

import 'package:flutter/material.dart';
import '../models/product.dart';
import '../services/api_service.dart';
import '../widgets/category_carousel.dart';
import '../widgets/product_card.dart';
// ¡Ya no importamos 'speech_to_text'!

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ApiService _apiService = ApiService();
  
  // Futuros para cargar los datos de la API
  late Future<List<Product>> _productsFuture;
  late Future<List<Category>> _categoriesFuture;
  
  // Estado para el filtro de categoría
  int? _selectedCategoryId;
  String _statusMessage = ''; // Para mostrar mensajes

  @override
  void initState() {
    super.initState();
    // Carga inicial de datos
    _productsFuture = _apiService.getProducts();
    _categoriesFuture = _apiService.getCategories();
  }

  // Lógica para filtrar la lista de productos
  List<Product> _filterProducts(List<Product> allProducts) {
    if (_statusMessage.isNotEmpty) {
       // Si hay un mensaje (ej. "Producto X añadido"), lo limpiamos
      Future.delayed(const Duration(seconds: 2), () {
        if (mounted) setState(() => _statusMessage = '');
      });
    }

    if (_selectedCategoryId == null) {
      return allProducts; // Muestra todos si no hay filtro
    }
    return allProducts
        .where((p) => p.categoria.id == _selectedCategoryId)
        .toList();
  }

  // Callback para cuando se selecciona una categoría en el carrusel
  void _onCategorySelected(int? categoryId) {
    setState(() {
      _selectedCategoryId = categoryId;
    });
  }

  // Callback para mostrar un mensaje cuando se añade al carrito
  void _onProductAdded(String productName) {
    setState(() {
      _statusMessage = '$productName añadido al carrito';
    });
    // Muestra un pop-up de confirmación
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$productName añadido al carrito'),
        duration: const Duration(seconds: 1),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SmartBoutique'),
        // Ya no tenemos el botón de búsqueda aquí,
        // porque está en la barra de navegación inferior.
      ),
      body: Column(
        children: [
          // 1. Carrusel de Categorías
          FutureBuilder<List<Category>>(
            future: _categoriesFuture,
            builder: (ctx, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                // Muestra un carrusel 'fantasma' mientras carga
                return const SizedBox(height: 60, child: Center(child: CircularProgressIndicator()));
              }
              if (snapshot.hasError || !snapshot.hasData) {
                return const SizedBox(height: 60, child: Center(child: Text('Error al cargar categorías')));
              }
              return CategoryCarousel(
                categories: snapshot.data!,
                selectedCategoryId: _selectedCategoryId,
                onCategorySelected: _onCategorySelected,
              );
            },
          ),
          
          // 2. Mensaje de estado (ej. "Producto añadido")
          if (_statusMessage.isNotEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
              child: Text(
                _statusMessage,
                style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
            ),

          // 3. Rejilla de Productos
          Expanded(
            child: FutureBuilder<List<Product>>(
              future: _productsFuture,
              builder: (ctx, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Center(
                    child: Text('Error al cargar productos: ${snapshot.error}'),
                  );
                }
                if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return const Center(child: Text('No se encontraron productos.'));
                }

                // Filtra los productos basados en la categoría seleccionada
                final displayedProducts = _filterProducts(snapshot.data!);

                if (displayedProducts.isEmpty) {
                  return const Center(child: Text('No hay productos en esta categoría.'));
                }

                return GridView.builder(
                  padding: const EdgeInsets.all(10.0),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2, // 2 columnas
                    crossAxisSpacing: 10,
                    mainAxisSpacing: 10,
                    childAspectRatio: 0.7, // Ajusta esto al tamaño de tu tarjeta
                  ),
                  itemCount: displayedProducts.length,
                  itemBuilder: (ctx, i) => ProductCard(
                    product: displayedProducts[i],
                    // Pasamos el callback para mostrar el mensaje
                    onAddedToCart: () => _onProductAdded(displayedProducts[i].nombre),
                  ),
                );
              },
            ),
          ),
        ],
      ),
      // --- HEMOS QUITADO EL BOTÓN DEL MICRÓFONO DE AQUÍ ---
    );
  }
}