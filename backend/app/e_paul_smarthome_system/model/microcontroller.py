from django.db import models

class Microcontroller(models.Model):
    key = models.CharField(max_length=20, unique=True, null = True, blank = True)
    name = models.CharField(max_length=50)
    account = models.ForeignKey("e_paul_smarthome_system.Account", related_name="microcontroller" ,verbose_name=("User"), on_delete=models.CASCADE)
    #filter = models.ForeignKey()
