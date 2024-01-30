from django.db import models

class User(models.Model):
    
    class Geschlecht(models.TextChoices):
        männlich = 'männlich'
        weiblich = 'weiblich'
        divers = 'divers'
    
    username = models.CharField(max_length=50, unique=True, null = True, blank = True)
    account = models.ForeignKey("e_paul_smarthome_system.Account", null = True, blank = True, related_name="user", verbose_name=("Account"), on_delete=models.CASCADE)
    pin = models.CharField(max_length=100)
    key = models.CharField(max_length=50, unique=True, null = True, blank = True)
    gender = models.TextField(choices=Geschlecht.choices, null = True, blank = True)
    birthdate = models.DateField(max_length=50, null = True, blank = True)
    
    