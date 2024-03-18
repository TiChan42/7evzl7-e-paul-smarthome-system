from django.db import models

class PortTemplate(models.Model):
    status_default = models.JSONField(null = True, blank = True)
    knownControllerType = models.ForeignKey("e_paul_smarthome_system.knownControllerType", null = True, blank = True, related_name="portTemplate" ,verbose_name=("Microcontroller"), on_delete=models.CASCADE)