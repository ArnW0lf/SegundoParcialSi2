import 'package:flutter/foundation.dart';
import '../models/product.dart';

class CartItem {
  final Product product;
  int cantidad;

  CartItem({required this.product, this.cantidad = 1});

  double get subtotal => product.precio * cantidad;
}

class CartProvider with ChangeNotifier {
  final Map<int, CartItem> _items = {};

  Map<int, CartItem> get items => {..._items};

  int get itemCount => _items.length;

  double get totalAmount {
    var total = 0.0;
    _items.forEach((key, cartItem) {
      total += cartItem.subtotal;
    });
    return total;
  }

  void addItem(Product product) {
    if (_items.containsKey(product.id)) {
      // Si ya existe, solo aumenta la cantidad
      _items.update(
        product.id,
        (existingItem) => CartItem(
          product: existingItem.product,
          cantidad: existingItem.cantidad + 1,
        ),
      );
    } else {
      // Si es nuevo, lo añade al map
      _items.putIfAbsent(product.id, () => CartItem(product: product));
    }
    notifyListeners(); // Notifica a los widgets que escuchan
  }

  void updateQuantity(int productId, int cantidad) {
    if (!_items.containsKey(productId)) return;

    if (cantidad > 0) {
      _items.update(
        productId,
        (existingItem) =>
            CartItem(product: existingItem.product, cantidad: cantidad),
      );
    } else {
      // Si la cantidad es 0 o menos, lo elimina
      removeItem(productId);
    }
    notifyListeners();
  }

  void removeItem(int productId) {
    _items.remove(productId);
    notifyListeners();
  }

  void clearCart() {
    _items.clear();
    notifyListeners();
  }
}
