from django.db import models

class GroupPort(models.Model):
    
    group = models.ForeignKey("e_paul_smarthome_system.Group", verbose_name=("Group"), related_name = "groupPort", on_delete=models.CASCADE)
    port = models.ForeignKey("e_paul_smarthome_system.Port", verbose_name=("Port"), related_name = "groupPort", on_delete=models.CASCADE)
    name = models.CharField(max_length = 20, verbose_name = ("Name"), null = True, blank = True)    