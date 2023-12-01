from django.db import models

class Scene(models.Model):
    function = models.ManyToManyField("e_paul_smarthome_system.function")
    startTime = models.DateTimeField()
    endTime = models.DateTimeField()
    description = models.CharField(max_length=100, null = True, blank = True)