from django.db import models

class Log(models.Model):
    
    class Status(models.TextChoices):
        ok = "ok"
        error = "error"
        clientError = "clientError"
        serverError = "serverError"
        warning = "warning"
        meassage = "message"

    endpoint = models.CharField(max_length = 100, null = True)
    responseCode = models.PositiveSmallIntegerField()
    method = models.CharField(max_length=10, null=True)
    status = models.TextField(choices=Status.choices, null = True, blank = True)
    remoteAddress = models.CharField(max_length = 20, null=True)
    execTime = models.IntegerField(null=True)
    time = models.IntegerField(null=True, blank=True)
    bodyResponse = models.TextField(null = True, blank = True)
    bodyRequest = models.TextField(null = True, blank = True)
    user = models.ForeignKey("e_paul_smarthome_system.User", null = True, blank = True, related_name="Log", verbose_name=("Log"), on_delete=models.CASCADE)
    