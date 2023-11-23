from django.db import models

class Group(models.Model):
    name = models.CharField(max_length=40, unique=True)
    description = models.CharField(max_length=100)
    kindOf = models.CharField(max_length=50)
    user = models.ForeignKey("e_paul_smarthome_system.User", verbose_name=("User"), on_delete=models.CASCADE)