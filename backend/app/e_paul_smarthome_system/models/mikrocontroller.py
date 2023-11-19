from django.db import models

class Mikrocontroller(models.Model):
    name = models.CharField(max_length=50)
    ip = models.CharField(max_length=50)
    funktionen = models.ForeignKey("e_paul_smarthome_system.funktion", verbose_name=_("Mikrocontroller"), on_delete=models.CASCADE)
    pins = models.ForeignKey("e_paul_smarthome_system.pins", verbose_name=_("Mikrocontroller"), on_delete=models.CASCADE)
    User = models.ForeignKey("e_paul_smarthome_system.User", verbose_name=_("Mikrocontroller"), on_delete=models.CASCADE)