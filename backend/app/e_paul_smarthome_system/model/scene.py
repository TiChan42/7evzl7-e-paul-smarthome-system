from django.db import models

class Scene(models.Model):
    group = models.ForeignKey("e_paul_smarthome_system.Group", verbose_name=("Group"), related_name = "scene", on_delete=models.CASCADE)
    startTime = models.DateTimeField()
    endTime = models.DateTimeField()
    description = models.CharField(max_length=100, null = True, blank = True)