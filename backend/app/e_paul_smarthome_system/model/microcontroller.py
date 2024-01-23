from django.db import models

class Microcontroller(models.Model):
    name = models.CharField(max_length=50)
    ip = models.CharField(max_length=50)
    User = models.ForeignKey("e_paul_smarthome_system.User", related_name="microcontroller" ,verbose_name=("User"), on_delete=models.CASCADE)
    #filter = models.ForeignKey()
