import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/cart_provider.dart';
import 'providers/user_provider.dart';
import 'screens/main_screen.dart';

// Import para las fechas (esto estaba bien)
import 'package:intl/date_symbol_data_local.dart';

// --- IMPORTACIÓN CORREGIDA ---
// Import para la localización (usa el paquete que acabas de instalar)
import 'package:flutter_localizations/flutter_localizations.dart'; 

void main() async {
  // Asegura que los bindings de Flutter estén inicializados
  WidgetsFlutterBinding.ensureInitialized();
  
  // Carga los datos de localización para español
  await initializeDateFormatting('es_ES', null); 
  
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (ctx) => CartProvider()),
        ChangeNotifierProvider(create: (ctx) => UserProvider()), 
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SmartBoutique',
      
      // --- CONFIGURACIÓN DE LOCALIZACIÓN CORREGIDA ---
      localizationsDelegates: const [
        // Estos son los delegados correctos que SÍ existen
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
         Locale('es', 'ES'), // Soporte para Español
         Locale('en', 'US'), // (Es bueno tener inglés como fallback)
      ],
      locale: const Locale('es', 'ES'), // Forzar el locale a español
      // ---------------------------------------------
      
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        scaffoldBackgroundColor: const Color(0xFFF4F6F8),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: Colors.black,
          elevation: 1,
          centerTitle: true,
          titleTextStyle: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.black,
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.blue[800],
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        ),
        useMaterial3: true,
      ),
      debugShowCheckedModeBanner: false,
      home: const MainScreen(), 
    );
  }
}