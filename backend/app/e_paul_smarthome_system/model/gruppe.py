from django.db import models

class Gruppe(models.Model):
    name = models.CharField(max_length=40, unique=True)
    beschreibung = models.CharField(max_length=100)
    art = models.CharField(max_length=50)
    user = models.ForeignKey("e_paul_smarthome_system.User", verbose_name=("User"), on_delete=models.CASCADE)