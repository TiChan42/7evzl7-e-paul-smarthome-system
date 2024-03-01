from django.db import models

class Port(models.Model):
    
    art = models.CharField(max_length=50, choices=[
        ("Eingang", "Eingang"), ("Ausgang", "Ausgang") # liste muss noch bestimmt werden
        ])
    
    microcontroller = models.ForeignKey("e_paul_smarthome_system.Microcontroller", verbose_name=("Microcontroller"), on_delete=models.CASCADE)
    inUse = models.BooleanField(default=False)