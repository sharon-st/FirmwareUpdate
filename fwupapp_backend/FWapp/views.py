from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404, redirect
from django.http import JsonResponse
from .models import FirmwarePackage
from .serializers import FirmwarePackageSerializer
from rest_framework.permissions import AllowAny
from django.core.files.base import File
import logging
from django.conf import settings
from storages.backends.azure_storage import AzureStorage  # Explicit import

logger = logging.getLogger(__name__)

def test_azure_upload(request):
    """
    Standalone test function for uploading a file to Azure.
    Expects the uploaded file under the key 'file'.
    """
    if request.method == 'POST':
        if 'file' not in request.FILES:
            return JsonResponse({"error": "No file provided."}, status=400)

        uploaded_file = request.FILES['file']
        try:
            azure_storage = AzureStorage()
            azure_storage.azure_container = settings.AZURE_MEDIA_CONTAINER 
            file_name = azure_storage.save(f'Firmware_packages/{uploaded_file.name}', File(uploaded_file))
            file_url = azure_storage.url(file_name)

            logger.info(f"File uploaded successfully to Azure: {file_url}")
            return JsonResponse({
                "message": "File uploaded successfully to Azure!",
                "file_url": file_url
            }, status=201)

        except Exception as e:
            logger.error(f"Error uploading file to Azure: {e}")
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)

def upload_file_to_azure(uploaded_file):
    """
    Helper function to upload a file to Azure Blob Storage.
    Returns the URL of the uploaded file.
    """
    azure_storage = AzureStorage()
    azure_storage.azure_container = settings.AZURE_MEDIA_CONTAINER  # Use the correct setting
    file_name = azure_storage.save(f'Firmware_packages/{uploaded_file.name}', File(uploaded_file))
    file_url = azure_storage.url(file_name)
    logger.info(f"File uploaded successfully to Azure: {file_url}")
    return file_url

class FirmwarePackageViewSet(viewsets.ModelViewSet):
    queryset = FirmwarePackage.objects.all()
    serializer_class = FirmwarePackageSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'version']
    permission_classes = [AllowAny]

    @action(detail=True, methods=['get'], url_path='download')
    def download_firmware(self, request, pk=None):
        firmware = get_object_or_404(FirmwarePackage, pk=pk)
        if firmware.fw_package_url:
            return JsonResponse({"file_url": firmware.fw_package_url})
        return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)

class FirmwareCUDView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
     
        if 'fw_package' not in request.FILES:
            return Response({"fw_package": ["No file was uploaded."]}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_file = request.FILES['fw_package']
        try:
     
            file_url = upload_file_to_azure(uploaded_file)
     
            if hasattr(request.data, '_mutable'):
                request.data._mutable = True
     
            request.data['fw_package_url'] = file_url
        except Exception as e:
            logger.error(f"Error uploading file to Azure: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = FirmwarePackageSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            firmware = serializer.save()
            response_data = FirmwarePackageSerializer(firmware, context={'request': request}).data
            response_data['fw_package_url'] = file_url  # Attach the Azure URL to the response
            return Response(response_data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        pk = request.query_params.get('pk')
        if not pk:
            return Response({"error": "Missing firmware ID."}, status=status.HTTP_400_BAD_REQUEST)

        firmware = get_object_or_404(FirmwarePackage, pk=pk)

     
        if 'fw_package' in request.FILES:
            uploaded_file = request.FILES['fw_package']
            try:
                file_url = upload_file_to_azure(uploaded_file)
                if hasattr(request.data, '_mutable'):
                    request.data._mutable = True
                request.data['fw_package_url'] = file_url
            except Exception as e:
                logger.error(f"Error uploading file to Azure: {e}")
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = FirmwarePackageSerializer(
            firmware, data=request.data, partial=True, context={'request': request}
        )
        if serializer.is_valid():
            firmware = serializer.save()
            return Response(
                FirmwarePackageSerializer(firmware, context={'request': request}).data,
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        pk = request.query_params.get('pk')
        if not pk:
            return Response({"error": "Missing firmware ID."}, status=status.HTTP_400_BAD_REQUEST)

        firmware = get_object_or_404(FirmwarePackage, pk=pk)
     
        firmware.delete()
        return Response({"message": "Firmware deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class FirmwareView(ListAPIView):
    queryset = FirmwarePackage.objects.all()
    serializer_class = FirmwarePackageSerializer
    permission_classes = [AllowAny]


class FirmwareDownloadView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
  
        firmware = get_object_or_404(FirmwarePackage, pk=pk)
        if firmware.fw_package_url:
  
            return redirect(firmware.fw_package_url)
        return Response({"error": "Firmware not found"}, status=status.HTTP_404_NOT_FOUND)