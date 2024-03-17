from django.db import models

class Microcontroller(models.Model):
    key = models.CharField(max_length=60, unique=True, null = True, blank = True)
    name = models.CharField(max_length=20, default = "ESP8266")
    type = models.CharField(max_length=32)
    account = models.ForeignKey("e_paul_smarthome_system.Account", related_name="microcontroller" ,verbose_name=("Account"), on_delete=models.CASCADE)
    #filter = models.ForeignKey()
