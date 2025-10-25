from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoriaViewSet,
    ProductoViewSet,
    ClienteViewSet,
    VentaViewSet,
    CrearVentaView
)

# Creamos un router para registrar automáticamente las URLs de los ViewSets.
router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'clientes', ClienteViewSet)
router.register(r'ventas', VentaViewSet)

# Las URLs de la API son determinadas automáticamente por el router.
urlpatterns = [
    path('ventas/crear/', CrearVentaView.as_view(), name='crear-venta'),
    path('', include(router.urls)),
]
