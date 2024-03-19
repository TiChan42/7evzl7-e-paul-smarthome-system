from django.db import models

class Scene(models.Model):
    group = models.ForeignKey("e_paul_smarthome_system.Group", verbose_name=("Group"), related_name = "scene", on_delete=models.CASCADE)
    name = models.CharField(max_length = 32)
    