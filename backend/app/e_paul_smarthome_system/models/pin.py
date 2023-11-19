from django.db import models

class Pin(models.Model):
    
    art = models.CharField(max_length=50, choices=[
        ("Eingang", "Eingang"), ("Ausgang", "Ausgang") # liste muss noch bestimmt werden
        ])
    
    used = models.BooleanField(default=False)