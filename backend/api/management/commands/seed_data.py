import random
from django.core.management.base import BaseCommand
from django.db import transaction
from backend.api.models import Categoria, Producto, Cliente, Venta

# Nombres de ejemplo para la tienda de ropa
NOMBRES_CATEGORIAS = {
    'Ropa Superior': ['Camisetas', 'Camisas', 'Blusas', 'Chaquetas', 'Polerones'],
    'Ropa Inferior': ['Pantalones', 'Jeans', 'Shorts', 'Faldas'],
    'Calzado': ['Zapatillas', 'Zapatos Formales', 'Botas', 'Sandalias'],
    'Accesorios': ['Gorros', 'Cinturones', 'Bufandas', 'Lentes de Sol']
}

NOMBRES_CLIENTES = [
    ('Ana', 'Gómez', 'ana.gomez@ejemplo.com'),
    ('Bruno', 'Díaz', 'bruno.diaz@ejemplo.com'),
    ('Carla', 'Mora', 'carla.mora@ejemplo.com'),
    ('Daniel', 'Soto', 'daniel.soto@ejemplo.com'),
    ('Elena', 'Vargas', 'elena.vargas@ejemplo.com'),
    ('Felipe', 'Ríos', 'felipe.rios@ejemplo.com'),
]


class Command(BaseCommand):
    help = 'Puebla la base de datos con datos de prueba para SmartSales365 (Tienda de Ropa)'

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write('Limpiando la base de datos antigua...')
        # Limpiamos en orden inverso a las dependencias para evitar ProtectedError
        Venta.objects.all().delete()  # Borra Ventas y sus Detalles en cascada
        Producto.objects.all().delete()
        Categoria.objects.all().delete()
        Cliente.objects.all().delete()

        self.stdout.write('Creando nuevos datos de prueba...')

        # --- Crear Clientes ---
        clientes_creados = []
        for nombre, apellido, email in NOMBRES_CLIENTES:
            cliente = Cliente.objects.create(
                nombre=f"{nombre} {apellido}",
                email=email
            )
            clientes_creados.append(cliente)

        self.stdout.write(f'Se crearon {len(clientes_creados)} clientes.')

        # --- Crear Categorías y Productos ---
        productos_creados_total = 0
        for categoria_padre, subcategorias in NOMBRES_CATEGORIAS.items():
            for nombre_subcategoria in subcategorias:
                # Crear la categoría
                categoria, created = Categoria.objects.get_or_create(
                    nombre=nombre_subcategoria,
                    defaults={
                        'descripcion': f'Ropa de la categoría {nombre_subcategoria}'}
                )

                # Crear entre 3 y 7 productos para esta categoría
                for _ in range(random.randint(3, 7)):
                    nombre_producto = f"{nombre_subcategoria} Modelo {random.choice(['Alpha', 'Beta', 'Gamma', 'Delta'])} {random.randint(100, 999)}"
                    Producto.objects.create(
                        nombre=nombre_producto,
                        descripcion=f'Una descripción para {nombre_producto}. Hecho con materiales de calidad.',
                        precio=round(random.uniform(19.99, 149.99), 2),
                        stock=random.randint(10, 100),
                        categoria=categoria
                    )
                    productos_creados_total += 1

        self.stdout.write(
            f'Se crearon {Categoria.objects.count()} categorías.')
        self.stdout.write(f'Se crearon {productos_creados_total} productos.')

        self.stdout.write(self.style.SUCCESS(
            '¡Base de datos poblada exitosamente con datos de tienda de ropa!'
        ))
