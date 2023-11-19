from django.db import models

class Mikrocontroller(models.Model):
    name = models.CharField(max_length=50)
    ip = models.CharField(max_length=50)
    User = models.ForeignKey("e_paul_smarthome_system.User", verbose_name=("User"), on_delete=models.CASCADE)