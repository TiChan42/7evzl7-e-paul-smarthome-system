from django.db import models

class Account(models.Model):
    firstname = models.CharField(max_length=40)
    lastname = models.CharField(max_length=40)
    password = models.CharField(max_length=100)
    email = models.CharField(max_length=40, unique=True)
    description = models.CharField(max_length=100, null = True, blank = True)
      