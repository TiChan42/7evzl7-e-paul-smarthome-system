from django.db import models

class CommandOption(models.Model):
    command = models.ForeignKey("e_paul_smarthome_system.Command", related_name="commandOption", verbose_name=("Command"), on_delete=models.CASCADE)
    key = models.CharField(max_length=50, verbose_name=("Key"))
    static = models.BooleanField(verbose_name=("Static"))
    value = models.CharField(max_length=50, verbose_name=("Value"))