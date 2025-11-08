// Archivo: lib/widgets/product_card.dart (Actualizado)

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../providers/cart_provider.dart';

class ProductCard extends StatelessWidget {
  final Product product;
  final VoidCallback? onAddedToCart; // <-- Callback opcional

  const ProductCard({
    super.key,
    required this.product,
    this.onAddedToCart, // <-- Añadido al constructor
  });

  @override
  Widget build(BuildContext context) {
    // Escucha al CartProvider SIN redibujar todo
    final cart = Provider.of<CartProvider>(context, listen: false);

    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      clipBehavior: Clip.antiAlias, // Para redondear la imagen
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Imagen
          Expanded(
            child: Container(
              color: Colors.grey[200],
              child: Image.network(
                product.imagenUrl,
                fit: BoxFit.cover,
                // Placeholder mientras carga
                loadingBuilder: (context, child, loadingProgress) {
                  if (loadingProgress == null) return child;
                  return const Center(child: CircularProgressIndicator());
                },
                // Fallback si la imagen falla
                errorBuilder: (context, error, stackTrace) {
                  return const Icon(Icons.shopping_bag_outlined,
                      color: Colors.grey, size: 50);
                },
              ),
            ),
          ),
          // Detalles (Nombre y Precio)
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product.nombre,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  'Bs. ${product.precio.toStringAsFixed(2)}',
                  style: TextStyle(
                    color: Colors.blue[800],
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                  ),
                ),
              ],
            ),
          ),
          // Botón de Añadir
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
            child: ElevatedButton.icon(
              onPressed: product.stock > 0
                  ? () {
                      cart.addItem(product); // Llama al provider
                      // Llama al callback si existe
                      if (onAddedToCart != null) {
                        onAddedToCart!(); 
                      }
                    }
                  : null, // Deshabilita el botón si no hay stock
              icon: const Icon(Icons.add_shopping_cart, size: 18),
              label: Text(product.stock > 0 ? 'Añadir' : 'Agotado'),
              style: ElevatedButton.styleFrom(
                backgroundColor: product.stock > 0 ? Colors.blue[800] : Colors.grey[400],
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 8),
                textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
    );
  }
}