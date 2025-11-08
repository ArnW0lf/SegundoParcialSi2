from django.db import models
import uuid

# Modelo para las categorías de productos


class Categoria(models.Model):
    """
    Almacena las categorías para organizar los productos.
    Ej: Camisetas, Pantalones, Zapatos.
    """
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"

# Modelo para los productos de la tienda


class Producto(models.Model):
    """
    Representa un artículo individual en venta.
    """
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    categoria = models.ForeignKey(
        Categoria, on_delete=models.PROTECT, related_name='productos')
    imagen_url = models.URLField(max_length=500, blank=True, null=True,
                                 default='https://placehold.co/300x300/EBF4FF/6366F1?text=Producto&font=Inter')

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"

# Modelo para los clientes


class Cliente(models.Model):
    """
    Almacena la información de los clientes registrados.
    Nota: En un proyecto real, se recomienda extender el modelo User de Django.
    """
    nombre = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    # Django maneja el hashing de contraseñas de forma segura,
    # por lo que no se almacena directamente.
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"

# Modelo para las ventas


class Venta(models.Model):
    """
    Encabezado de una transacción de venta. Contiene la información general.
    """
    ESTADO_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('PAGADO', 'Pagado'),
        ('ENVIADO', 'Enviado'),
        ('CANCELADO', 'Cancelado'),
    ]

    METODO_PAGO_CHOICES = [
        ('PAYPAL', 'PayPal'),
        ('STRIPE', 'Stripe'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cliente = models.ForeignKey(
        Cliente, on_delete=models.SET_NULL, null=True, related_name='compras')
    fecha_venta = models.DateTimeField(auto_now_add=True)
    monto_total = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00)
    estado = models.CharField(
        max_length=20, choices=ESTADO_CHOICES, default='PENDIENTE')
    metodo_pago = models.CharField(max_length=20, choices=METODO_PAGO_CHOICES)

    def __str__(self):
        return f"Venta {self.id} - {self.cliente.nombre if self.cliente else 'N/A'}"

    class Meta:
        verbose_name = "Venta"
        verbose_name_plural = "Ventas"
        ordering = ['-fecha_venta']

# Modelo para el detalle de cada venta


class DetalleVenta(models.Model):
    """
    Representa cada línea de producto dentro de una venta.
    """
    venta = models.ForeignKey(
        Venta, on_delete=models.CASCADE, related_name='detalles')
    producto = models.ForeignKey(
        Producto, on_delete=models.PROTECT, related_name='ventas')
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def subtotal(self):
        return self.cantidad * self.precio_unitario

    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre} en Venta {self.venta.id}"

    class Meta:
        verbose_name = "Detalle de Venta"
        verbose_name_plural = "Detalles de Venta"
