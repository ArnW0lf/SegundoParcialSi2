import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/venta.dart'; 
import '../services/api_service.dart';
import '../providers/user_provider.dart';
import 'package:intl/intl.dart'; 
import 'main_screen.dart'; // Importa MainScreen para acceder a su estado PÚBLICO

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  final ApiService _apiService = ApiService();
  Future<List<Venta>>? _salesFuture;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final userId = Provider.of<UserProvider>(context).clienteId;
    if (userId != null) {
      _salesFuture = _loadSales(userId);
    } else {
      _salesFuture = null;
    }
  }
  
  Future<List<Venta>> _loadSales(int clienteId) async {
    final allSales = await _apiService.getSales();
    return allSales.where((venta) => venta.cliente.id == clienteId).toList();
  }

  Future<void> _refreshOrders() async {
    final userId = Provider.of<UserProvider>(context, listen: false).clienteId;
    if (userId != null) {
      setState(() {
        _salesFuture = _loadSales(userId);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mis Pedidos'),
      ),
      body: userProvider.isLoggedIn
          ? _buildOrdersList()
          : _buildLoggedOutView(),
    );
  }

  Widget _buildLoggedOutView() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.person_off_outlined, size: 80, color: Colors.grey),
            const SizedBox(height: 20),
            const Text(
              'Inicia sesión',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            const Text(
              'Debes iniciar sesión en la pestaña "Perfil" para ver tu historial de pedidos.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            const SizedBox(height: 30),
            ElevatedButton(
              onPressed: () {
                // --- INICIO DE LA CORRECCIÓN ---
                // Ahora buscamos la clase pública 'MainScreenState'
                // y llamamos al método público 'onItemTapped'
                context.findAncestorStateOfType<MainScreenState>()?.onItemTapped(4);
                // --- FIN DE LA CORRECCIÓN ---
              }, 
              child: const Text('Ir a Perfil')
            )
          ],
        ),
      ),
    );
  }

  Widget _buildOrdersList() {
    return FutureBuilder<List<Venta>>(
      future: _salesFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }

        if (snapshot.hasError) {
          return Center(child: Text('Error al cargar pedidos: ${snapshot.error}'));
        }

        if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return const Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.receipt_long_outlined, size: 80, color: Colors.grey),
                SizedBox(height: 20),
                Text(
                  'Sin pedidos',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                ),
                Text(
                  'Aún no has realizado ninguna compra.',
                  style: TextStyle(fontSize: 16, color: Colors.grey),
                ),
              ],
            ),
          );
        }

        final ventas = snapshot.data!;
        ventas.sort((a, b) => b.fechaVenta.compareTo(a.fechaVenta));

        return RefreshIndicator(
          onRefresh: _refreshOrders,
          child: ListView.builder(
            padding: const EdgeInsets.all(10),
            itemCount: ventas.length,
            itemBuilder: (ctx, i) => _buildOrderCard(ventas[i]),
          ),
        );
      },
    );
  }

  Widget _buildOrderCard(Venta venta) {
    final String fechaFormateada = DateFormat('dd MMM yyyy', 'es_ES').format(venta.fechaVenta);

    return Card(
      elevation: 2,
      margin: const EdgeInsets.only(bottom: 15),
      child: ExpansionTile(
        title: Text(
          'Pedido del $fechaFormateada',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text(
          'Total: Bs. ${venta.montoTotal.toStringAsFixed(2)} - Estado: ${venta.estado}',
          style: TextStyle(color: Colors.grey[700]),
        ),
        leading: Icon(Icons.receipt, color: Colors.blue[800]),
        childrenPadding: const EdgeInsets.all(15),
        children: [
          ...venta.detalles.map((detalle) {
            return ListTile(
              leading: CircleAvatar(
                backgroundImage: NetworkImage(detalle.producto.imagenUrl),
                onBackgroundImageError: (e, s) {}, 
                backgroundColor: Colors.grey[200],
                child: const Icon(Icons.shopping_bag_outlined, color: Colors.grey),
              ),
              title: Text(detalle.producto.nombre),
              subtitle: Text('${detalle.cantidad} x Bs. ${detalle.precioUnitario.toStringAsFixed(2)}'),
              trailing: Text(
                'Bs. ${detalle.subtotal.toStringAsFixed(2)}',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            );
          }).toList(),
          const Divider(height: 20),
          Text(
            'ID Pedido: ${venta.id}',
            style: const TextStyle(color: Colors.grey, fontSize: 12),
          ),
        ],
      ),
    );
  }
}