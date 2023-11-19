from django.contrib import admin
from .model.gruppe import Gruppe
from .model.funktion import Funktion
from .model.mikrocontroller import Mikrocontroller
from .model.pin import Pin
from .model.user import User

# Register your models here.
admin.site.register(Gruppe)
admin.site.register(Funktion)
admin.site.register(Mikrocontroller)
admin.site.register(Pin)
admin.site.register(User)