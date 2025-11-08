import 'package:flutter/material.dart';
import '../models/product.dart';
import '../services/api_service.dart';
import '../widgets/product_card.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final ApiService _apiService = ApiService();
  final _searchController = TextEditingController();
  
  List<Product> _allProducts = []; // Almacena todos los productos
  List<Product> _filteredProducts = []; // Productos filtrados por la búsqueda
  bool _isLoading = true;
  String _errorMessage = '';

  @override
  void initState() {
    super.initState();
    _loadProducts();
  }

  Future<void> _loadProducts() async {
    try {
      final products = await _apiService.getProducts();
      setState(() {
        _allProducts = products;
        _filteredProducts = products; // Inicialmente, muestra todos
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString().replaceFirst("Exception: ", "");
        _isLoading = false;
      });
    }
  }

  void _filterProducts(String query) {
    if (query.isEmpty) {
      setState(() {
        _filteredProducts = _allProducts;
      });
      return;
    }

    final lowerQuery = query.toLowerCase();
    setState(() {
      _filteredProducts = _allProducts.where((product) {
        return product.nombre.toLowerCase().contains(lowerQuery);
      }).toList();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _searchController,
          autofocus: true, // Abre el teclado automáticamente
          decoration: InputDecoration(
            hintText: 'Buscar en SmartBoutique...',
            border: InputBorder.none,
            suffixIcon: IconButton(
              icon: const Icon(Icons.clear),
              onPressed: () {
                _searchController.clear();
                _filterProducts('');
              },
            ),
          ),
          onChanged: _filterProducts,
        ),
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_errorMessage.isNotEmpty) {
      return Center(
        child: Text('Error al cargar productos: $_errorMessage'),
      );
    }

    if (_filteredProducts.isEmpty) {
      if (_searchController.text.isNotEmpty) {
        return const Center(child: Text('No se encontraron productos.'));
      } else {
        return const Center(child: Text('Escribe para buscar...'));
      }
    }

    // Muestra los resultados en una cuadrícula
    return GridView.builder(
      padding: const EdgeInsets.all(10.0),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
        childAspectRatio: 0.7, // Ajusta esto según el diseño de tu ProductCard
      ),
      itemCount: _filteredProducts.length,
      itemBuilder: (ctx, i) => ProductCard(
        product: _filteredProducts[i],
      ),
    );
  }
}