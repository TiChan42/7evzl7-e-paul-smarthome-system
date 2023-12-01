from django.contrib import admin
from .model.group import Group
from .model.function import Function
from .model.microcontroller import Microcontroller
from .model.pin import Pin
from .model.user import User
from .model.scene import Scene
from .model.log import Log



# Register your models here.
admin.site.register(Group)
admin.site.register(Function)
admin.site.register(Microcontroller)
admin.site.register(Pin)
admin.site.register(User)
admin.site.register(Scene)
admin.site.register(Log)