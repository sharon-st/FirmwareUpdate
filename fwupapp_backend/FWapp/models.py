from django.db import models

class FirmwarePackage(models.Model):
    name = models.CharField(max_length=200)
    version = models.CharField(max_length=10)
    updated_by = models.CharField(max_length=20)
    note = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    fw_package_url = models.URLField()  # Stores the Azure Blob URL

    def __str__(self):
        return f"{self.name} - {self.version}"
