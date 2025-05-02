from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FirmwarePackageViewSet, FirmwareCUDView, FirmwareView
from django.urls import path
from .views import test_azure_upload
from django.views.decorators.csrf import csrf_exempt
router = DefaultRouter()
router.register(r'firmware-packages', FirmwarePackageViewSet, basename='firmwarepackage')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/firmware-cud/', FirmwareCUDView.as_view(), name='firmware_cud'),
    path('api/firmware-view/', FirmwareView.as_view(), name='firmware_view'),
    path('api/test-upload/', csrf_exempt(test_azure_upload)),

    #path('api/firmware-download-proxy/<int:pk>/', FirmwareDownloadProxyView.as_view(), name='firmware_download_proxy'),

    

]
