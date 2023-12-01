from django.db import models

class User(models.Model):
    
    class Geschlecht(models.TextChoices):
        männlich = 'männlich'
        weiblich = 'weiblich'
        divers = 'divers'
    
    firstname = models.CharField(max_length=40)
    lastname = models.CharField(max_length=40)
    group = models.ForeignKey("e_paul_smarthome_system.Group", null = True, blank = True, related_name = "user", verbose_name=("Group"), on_delete=models.CASCADE)
    email = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=50)
    key = models.CharField(max_length=50, unique=True)
    gender = models.TextField(choices=Geschlecht.choices, null = True, blank = True)
    birthdate = models.DateField(max_length=50, null = True, blank = True)
    
    