from django.db import models

class User(models.Model):
    
    class Geschlecht(models.TextChoices):
        männlich = 'männlich'
        weiblich = 'weiblich'
        divers = 'divers'
    
    firstname = models.CharField(max_length=40)
    lastname = models.CharField(max_length=40)
    email = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=50)
    key = models.CharField(max_length=50, unique=True)
    gender = models.TextField(choices=Geschlecht.choices)
    birthdate = models.DateField(max_length=50)
    
    