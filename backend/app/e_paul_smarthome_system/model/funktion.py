from django.db import models

class Funktion(models.Model):
    funktion = models.CharField(max_length=50, unique=True)
    beschreibung = models.CharField(max_length=100)
    mikrocontroller = models.ForeignKey("e_paul_smarthome_system.Mikrocontroller", verbose_name=("Mikrocontroller"), on_delete=models.CASCADE)