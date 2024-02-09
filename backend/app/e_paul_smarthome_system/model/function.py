from django.db import models

class Function(models.Model):
    function = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=100)
    microcontroller = models.ForeignKey("e_paul_smarthome_system.Microcontroller", verbose_name=("Microcontroller"), on_delete=models.CASCADE)