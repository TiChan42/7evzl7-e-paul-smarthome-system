from django.db import models

class PortTemplate(models.Model):
    status_default = models.JSONField(null = True, blank = True)