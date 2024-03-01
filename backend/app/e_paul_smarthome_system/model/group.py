from django.db import models

class Group(models.Model):
    
    class GroupType(models.TextChoices):
        STANDARD = "Standard", 
        FAVORITE = "Favorite"
        ASSIGNMENT = "Assignment"
    
    user = models.ForeignKey("e_paul_smarthome_system.User", verbose_name=("User"), related_name="group", on_delete=models.CASCADE)
    groupType = models.TextField(choices=GroupType.choices, null = True, blank = True)
    