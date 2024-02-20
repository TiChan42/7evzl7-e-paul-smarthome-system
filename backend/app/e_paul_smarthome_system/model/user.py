from django.db import models

class User(models.Model):
    
    class Geschlecht(models.TextChoices):
        männlich = 'männlich'
        weiblich = 'weiblich'
        divers = 'divers'
    
    class Role(models.TextChoices):
        superuser = 'superuser'
        admin = 'admin'
        user = 'user'
        
    username = models.CharField(max_length=16, unique=True, null = True, blank = True)
    account = models.ForeignKey("e_paul_smarthome_system.Account", null = True, blank = True, related_name="user", verbose_name=("Account"), on_delete=models.CASCADE)
    pin = models.CharField(max_length=32)
    key = models.CharField(max_length=50, unique=True, null = True, blank = True)
    role = models.TextField(choices = Role.choices)
    pictureid = models.IntegerField(null = True, blank = True)
    gender = models.TextField(choices=Geschlecht.choices, null = True, blank = True)
    birthdate = models.DateField(max_length=50, null = True, blank = True)
    rights = models.JSONField(null = True, blank = True)
    
    def changeRights(self, rights):
        self.rights = { 
                    "userSettings" : rights["userSettings"],
                    "adduser" : rights["adduser"],
                    "deleteuser" : rights["deleteuser"],
                    "userManagement" : rights["userManagement"],
                    "deviceManagement" : rights["deviceManagement"],
                    "deviceSettings" : rights["deviceSettings"],
                    "addDevice" : rights["addDevice"],
                    "deleteDevice" : rights["deleteDevice"],
                    "addRightsController" : rights["addRightsController"],
                    "promoteUser" : rights["promoteUser"],
                    "demoteUser" : rights["demoteUser"]
                    }
        print(self)
        self.save()
        
        
    def save(self, *args, **kwargs):
        self.username = self.username
        self.account = self.account
        self.pin = self.pin
        self.key = self.key
        self.role = self.role
        self.pictureid = self.pictureid
        self.gender = self.gender
        self.birthdate = self.birthdate

        if self.rights == None:
            match self.role:
                case 'user':
                    self.rights = { 
                        "userSettings" : 1,
                        "adduser" : 0,
                        "deleteuser" : 0,
                        "userManagement" : 0,
                        "deviceManagement" : 0,
                        "deviceSettings" : 0,
                        "addDevice" : 0,
                        "deleteDevice" : 0,
                        "addRightsController" : 0,
                        "promoteUser" : 0,
                        "demoteUser" : 0,
                        }
                case 'admin':
                    self.rights = {   
                        "userSettings" : 1,
                        "adduser" : 1,
                        "deleteuser" : 1,
                        "userManagement" : 1,
                        "deviceManagement" : 1,
                        "deviceSettings" : 1,
                        "addDevice" : 1,
                        "deleteDevice" : 1,
                        "addRightsController" : 1,
                        "promoteUser" : 1,
                        "demoteUser" : 1,
                        }
                case 'superuser':
                    self.rights = {   
                        "userSettings" : 1,
                        "adduser" : 1,
                        "deleteuser" : 1,
                        "userManagement" : 1,
                        "deviceManagement" : 1,
                        "deviceSettings" : 1,
                        "addDevice" : 1,
                        "deleteDevice" : 1,
                        "addRightsController" : 1,
                        "promoteUser" : 1,
                        "demoteUser" : 1,
                    }
        else:
            self.rights = self.rights
        super().save(*args, **kwargs)


