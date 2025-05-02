from rest_framework import serializers 
from .models import FirmwarePackage

class FirmwarePackageSerializer(serializers.ModelSerializer):
    # Define it as a URLField that is not read-only
    fw_package_url = serializers.URLField(required=False)

    class Meta:
        model = FirmwarePackage
        fields = ['name', 'version', 'updated_by', 'note', 'created_at', 'fw_package_url']
        read_only_fields = ['created_at']

    
# from rest_framework import serializers
# from .models import FirmwarePackage

# class FirmwarePackageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model=FirmwarePackage
#         fields = ['name', 'version','updated_by','note','created_at','fw_package']
