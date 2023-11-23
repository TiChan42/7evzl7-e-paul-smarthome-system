from django.db import models

class Pin(models.Model):
    
    art = models.CharField(max_length=50, choices=[
        ("Eingang", "Eingang"), ("Ausgang", "Ausgang") # liste muss noch bestimmt werden
        ])
    
    mikrocontroller = models.ForeignKey("e_paul_smarthome_system.Microcontroller", verbose_name=("Microcontroller"), on_delete=models.CASCADE)
    used = models.BooleanField(default=False)