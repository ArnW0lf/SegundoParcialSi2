from rest_framework import serializers
from api.models import Producto, Categoria, Cliente, Venta, DetalleVenta

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    # Para la lectura, mostramos el nombre de la categoría, no solo su ID.
    categoria = serializers.StringRelatedField()

    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'descripcion', 'precio', 'stock', 'categoria']

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'email', 'fecha_registro']

# --- Serializers para el complejo Endpoint de Ventas ---

class DetalleVentaInputSerializer(serializers.Serializer):
    """Serializer para validar cada item del carrito."""
    producto_id = serializers.IntegerField()
    cantidad = serializers.IntegerField(min_value=1)

    def validate_producto_id(self, value):
        """Verifica que el producto exista."""
        if not Producto.objects.filter(id=value).exists():
            raise serializers.ValidationError("El producto con este ID no existe.")
        return value

class VentaInputSerializer(serializers.Serializer):
    """Serializer para validar los datos de entrada para crear una venta."""
    cliente_id = serializers.IntegerField()
    metodo_pago = serializers.ChoiceField(choices=Venta.METODO_PAGO_CHOICES)
    detalles = DetalleVentaInputSerializer(many=True)

    def validate_cliente_id(self, value):
        """Verifica que el cliente exista."""
        if not Cliente.objects.filter(id=value).exists():
            raise serializers.ValidationError("El cliente con este ID no existe.")
        return value
    
    def validate_detalles(self, value):
        """Verifica que la lista de detalles no esté vacía."""
        if not value:
            raise serializers.ValidationError("La venta debe tener al menos un producto.")
        return value

class DetalleVentaOutputSerializer(serializers.ModelSerializer):
    """Serializer para mostrar los detalles de una venta ya creada."""
    producto = ProductoSerializer()

    class Meta:
        model = DetalleVenta
        fields = ['producto', 'cantidad', 'precio_unitario', 'subtotal']

class VentaOutputSerializer(serializers.ModelSerializer):
    """Serializer para mostrar la información completa de una venta."""
    cliente = ClienteSerializer()
    detalles = DetalleVentaOutputSerializer(many=True)

    class Meta:
        model = Venta
        fields = ['id', 'cliente', 'fecha_venta', 'monto_total', 'estado', 'metodo_pago', 'detalles']