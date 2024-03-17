from django.db import models

class Command(models.Model):
    
    class Type(models.IntegerChoices):
        COMMAND = 1
        RESPONSE = 2
        RESET = 3


    
    
    portTemplate = models.ForeignKey("e_paul_smarthome_system.PortTemplate", related_name="command", verbose_name=("PortTemplate"), on_delete=models.CASCADE)
    type = models.IntegerField(choices = Type.choices, null = True, blank = True)
    