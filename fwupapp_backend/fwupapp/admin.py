from django.contrib import admin
from django.http import HttpResponseRedirect
from django.urls import reverse
from ..FWapp.models import FirmwarePackage


from django.contrib import admin
from ..FWapp.models import FirmwarePackage

admin.site.register(FirmwarePackage)