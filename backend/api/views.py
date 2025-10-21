from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction
from api.models import Producto, Categoria, Cliente, Venta, DetalleVenta
from .serializers import (
    ProductoSerializer, CategoriaSerializer, ClienteSerializer,
    VentaInputSerializer, VentaOutputSerializer
)

# Usamos ModelViewSet para obtener un CRUD completo con poco código.
class CategoriaViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gestionar Categorías.
    """
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gestionar Productos.
    """
    queryset = Producto.objects.all().select_related('categoria')
    serializer_class = ProductoSerializer

class ClienteViewSet(viewsets.ModelViewSet):
    """
    API endpoint para gestionar Clientes.
    """
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

class VentaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint para listar y ver detalles de Ventas existentes.
    La creación se maneja a través de un endpoint específico.
    """
    queryset = Venta.objects.all().prefetch_related('detalles__producto__categoria', 'cliente')
    serializer_class = VentaOutputSerializer

class CrearVentaView(APIView):
    """
    Endpoint para la creación de una nueva venta.
    Recibe los datos del cliente, método de pago y el carrito de compras.
    """
    def post(self, request, *args, **kwargs):
        # 1. Validar los datos de entrada
        serializer = VentaInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data
        cliente_id = validated_data['cliente_id']
        detalles_data = validated_data['detalles']

        try:
            # Usamos una transacción para asegurar la integridad de los datos.
            # Si algo falla, toda la operación se revierte.
            with transaction.atomic():
                # 2. Obtener el cliente
                cliente = Cliente.objects.get(id=cliente_id)

                # 3. Crear el encabezado de la Venta
                nueva_venta = Venta.objects.create(
                    cliente=cliente,
                    metodo_pago=validated_data['metodo_pago'],
                    estado='PAGADO' # Asumimos que el pago fue exitoso
                )

                monto_total_calculado = 0

                # 4. Procesar cada item del carrito
                for item_data in detalles_data:
                    producto = Producto.objects.get(id=item_data['producto_id'])
                    cantidad = item_data['cantidad']

                    # Validar stock disponible
                    if producto.stock < cantidad:
                        raise ValueError(f"Stock insuficiente para el producto: {producto.nombre}")

                    # Crear el detalle de la venta
                    DetalleVenta.objects.create(
                        venta=nueva_venta,
                        producto=producto,
                        cantidad=cantidad,
                        precio_unitario=producto.precio
                    )

                    # Actualizar el stock del producto
                    producto.stock -= cantidad
                    producto.save()

                    # Calcular el monto total
                    monto_total_calculado += producto.precio * cantidad

                # 5. Actualizar el monto total en la Venta
                nueva_venta.monto_total = monto_total_calculado
                nueva_venta.save()

                # 6. Preparar la respuesta con los datos de la venta creada
                output_serializer = VentaOutputSerializer(nueva_venta)
                return Response(output_serializer.data, status=status.HTTP_201_CREATED)

        except Producto.DoesNotExist:
            return Response({"error": "Uno de los productos no fue encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            # Captura el error de stock insuficiente
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Captura cualquier otro error inesperado
            return Response({"error": f"Ocurrió un error inesperado: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
