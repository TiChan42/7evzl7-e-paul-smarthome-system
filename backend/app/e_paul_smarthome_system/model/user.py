from django.db import models

class User(models.Model):
    
    class Geschlecht(models.TextChoices):
        männlich = 'männlich'
        weiblich = 'weiblich'
        divers = 'divers'
    
    vorname = models.CharField(max_length=40)
    nachname = models.CharField(max_length=40)
    email = models.CharField(max_length=50, unique=True)
    passwort = models.CharField(max_length=50)
    key = models.CharField(max_length=50, unique=True)
    geschlecht = models.TextField(choices=Geschlecht.choices)
    geburtsdatum = models.DateField(max_length=50)
    
    