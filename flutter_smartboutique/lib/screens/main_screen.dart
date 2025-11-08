import 'package:flutter/material.dart';
import 'home_screen.dart';      // Importa la vista Home
import 'cart_screen.dart';      // Importa la vista Carrito
import 'profile_screen.dart';   // Importa la vista Perfil
import 'search_screen.dart';    // Importa la vista Búsqueda
import 'orders_screen.dart';    // Importa la vista Pedidos

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  // CORRECCIÓN: Llama a la clase pública
  State<MainScreen> createState() => MainScreenState();
}

// CORRECCIÓN: La clase ahora es pública (sin '_')
class MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0; 

  static const List<Widget> _widgetOptions = <Widget>[
    HomeScreen(),
    SearchScreen(),
    CartScreen(),
    OrdersScreen(),
    ProfileScreen(),
  ];

  // CORRECCIÓN: El método ahora es público (sin '_')
  // para que 'orders_screen' pueda llamarlo.
  void onItemTapped(int index) {
    setState(() {
      _selectedIndex = index; 
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: _widgetOptions.elementAt(_selectedIndex),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
            label: 'Tienda',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.search_outlined),
            activeIcon: Icon(Icons.search),
            label: 'Buscar',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.shopping_cart_outlined),
            activeIcon: Icon(Icons.shopping_cart),
            label: 'Carrito',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.receipt_long_outlined),
            activeIcon: Icon(Icons.receipt_long),
            label: 'Pedidos',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person),
            label: 'Perfil',
          ),
        ],
        currentIndex: _selectedIndex, 
        selectedItemColor: Colors.blue[800], 
        unselectedItemColor: Colors.grey[600],
        showUnselectedLabels: true, 
        onTap: onItemTapped, // Llama al método público
        type: BottomNavigationBarType.fixed, 
      ),
    );
  }
}