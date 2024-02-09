from django.db import models

class Account(models.Model):
    password = models.CharField(max_length=100)
    email = models.CharField(max_length=40, unique=True)
    description = models.CharField(max_length=100, null = True, blank = True)
      