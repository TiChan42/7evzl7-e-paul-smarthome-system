from django.db import models

class Log(models.Model):
    
    class Status(models.TextChoices):
        error = "error"
        warning = "warning"
        notification = "notification"

    status = models.TextField(choices=Status.choices)
    date = models.DateField(auto_now_add = True)
    message = models.TextField()
    description = models.CharField(max_length = 100)