from django.db import models

class Log(models.Model):
    
    class Status(models.TextChoices):
        error = "error"
        warning = "warning"
        notification = "notification"
        meassage = "message"

    endpoint = models.CharField(max_length = 100, null = True)
    responseCode = models.PositiveSmallIntegerField()
    method = models.CharField(max_length=10, null=True)
    status = models.TextField(choices=Status.choices, null = True, blank = True)
    remoteAddress = models.CharField(max_length = 20, null=True)
    execTime = models.IntegerField(null=True)
    date = models.DateField(auto_now = True)
    bodyResponse = models.TextField()
    bodyRequest = models.TextField()
    user = models.ForeignKey("e_paul_smarthome_system.User", null = True, blank = True, related_name="Log", verbose_name=("Log"), on_delete=models.CASCADE)
    