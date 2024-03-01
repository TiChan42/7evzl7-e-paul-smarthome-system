from django.contrib import admin
from .model.account import Account
from .model.function import Function
from .model.microcontroller import Microcontroller
from .model.port import Port
from .model.user import User
from .model.scene import Scene
from .model.log import Log
from .model.state import State
from .model.group import Group
from .model.groupPort import GroupPort

# Register your models here.
admin.site.register(Account)
admin.site.register(Function)
admin.site.register(Microcontroller)
admin.site.register(Port)
admin.site.register(User)
admin.site.register(Scene)
admin.site.register(Log)
admin.site.register(State)
admin.site.register(Group)
admin.site.register(GroupPort)