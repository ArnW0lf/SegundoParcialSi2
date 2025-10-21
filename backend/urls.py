from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    # Incluimos las URLs de nuestra aplicación de la API
    path('api/', include('backend.api.urls')),

    # Rutas para la documentación de la API con drf-spectacular
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Interfaz de usuario de Swagger:
    path('api/schema/swagger-ui/',
         SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
