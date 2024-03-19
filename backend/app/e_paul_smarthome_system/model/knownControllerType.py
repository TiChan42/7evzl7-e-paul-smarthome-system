from django.db import models

class KnownControllerType(models.Model):
    account = models.ForeignKey("e_paul_smarthome_system.Account", related_name="knownControllerType" ,verbose_name=("Account"), on_delete=models.CASCADE)
    type = models.CharField(max_length=50, null = True, blank = True)