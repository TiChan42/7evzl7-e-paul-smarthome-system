from django.db import models
from .account import Account

import random

class User(models.Model):
    
    class Geschlecht(models.TextChoices):
        männlich = 'männlich'
        weiblich = 'weiblich'
        divers = 'divers'
    
    class Role(models.TextChoices):
        superuser = 'superuser'
        admin = 'admin'
        user = 'user'
        
    username = models.CharField(max_length=12, null = True, blank = True)
    account = models.ForeignKey("e_paul_smarthome_system.Account", null = True, blank = True, related_name="user", verbose_name=("Account"), on_delete=models.CASCADE)
    pin = models.CharField(max_length=60, default = "", blank = True)
    role = models.TextField(choices = Role.choices)
    imageName = models.CharField(max_length = 32,null = True, blank = True)
    gender = models.TextField(choices=Geschlecht.choices, null = True, blank = True)
    birthdate = models.DateField(null = True, blank = True)
    rights = models.JSONField(null = True, blank = True)
    
    def changeRights(self, rights):
        self.rights = { 
                    "mayChangeUserSettings" : rights["mayChangeUserSettings"],
                    "mayDeleteUser" : rights["mayDeleteUser"],
                    "mayAssignController" : rights["mayAssignController"],
                    "mayChangeUserType" : rights["mayChangeUserType"],
                    "mayChangeUserRights" : rights["mayChangeUserRights"],
                    
                    "mayAddUser" : rights["mayAddUser"],
                    "mayChangeAccountSettings" : rights["mayChangeAccountSettings"],
                    
                    "mayChangeOwnUserSettings" : rights["mayChangeOwnUserSettings"],
                    "mayDeleteSelf" : rights["mayDeleteSelf"],
                    
                    "mayEditControllers" : rights["mayEditControllers"],
                    "mayDeleteControllers" : rights["mayDeleteControllers"]
                    }
        self.save()
        
    def save(self, *args, **kwargs):
        self.username = self.username
        self.account = self.account
        self.pin = self.pin
        self.role = self.role
        self.imageName = self.imageName
        self.gender = self.gender
        self.birthdate = self.birthdate

        if self.imageName == None:
            self.imageName = "user_profile_" + str(random.randint(1,7)) + ".jpg"
        else:
            self.imageName = self.imageName
        
        if self.rights == None:
            match self.role:
                case 'user':
                    self.rights = {
                        "mayChangeUserSettings": 0,
                        "mayDeleteUser": 0,
                        "mayAssignController": 0,
                        "mayChangeUserType": 0,
                        "mayChangeUserRights": 0,

                        "mayAddUser": 0,
                        "mayChangeAccountSettings": 0,

                        "mayChangeOwnUserSettings": 1,
                        "mayDeleteSelf": 1,

                        "mayEditControllers": 0,
                        "mayDeleteControllers": 0
                        }
                case 'admin':
                    self.rights = {
                        "mayChangeUserSettings": 1,
                        "mayDeleteUser": 1,
                        "mayAssignController": 1,
                        "mayChangeUserType": 1,
                        "mayChangeUserRights": 1,

                        "mayAddUser": 1,
                        "mayChangeAccountSettings": 0,

                        "mayChangeOwnUserSettings": 1,
                        "mayDeleteSelf": 1,

                        "mayEditControllers": 1,
                        "mayDeleteControllers": 1
                        }
                case 'superuser':
                    self.rights = {
                        "mayChangeUserSettings": 1,
                        "mayDeleteUser": 1,
                        "mayAssignController": 1,
                        "mayChangeUserType": 1,
                        "mayChangeUserRights": 1,

                        "mayAddUser": 1,
                        "mayChangeAccountSettings": 1,

                        "mayChangeOwnUserSettings": 1,
                        "mayDeleteSelf": 1,

                        "mayEditControllers": 1,
                        "mayDeleteControllers": 1
                        }
        else:
            self.rights = self.rights
        super().save(*args, **kwargs)


