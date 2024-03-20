from django.db import models

class State(models.Model):
    scene = models.ForeignKey("e_paul_smarthome_system.Scene", verbose_name=("Scene"), related_name = "state", on_delete=models.CASCADE)
    port = models.ForeignKey("e_paul_smarthome_system.Port", verbose_name=("Port"), related_name = "state", on_delete=models.CASCADE)
    state = models.JSONField()