from django.db import models

class Port(models.Model):
    
    name = models.CharField(max_length=50, null = True, blank = True)
    type = models.CharField(max_length=50, null = True, blank = True)
    microcontroller = models.ForeignKey("e_paul_smarthome_system.Microcontroller", related_name="port", verbose_name=("Microcontroller"), on_delete=models.CASCADE)
