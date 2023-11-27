from django import urls

from .views.userView import UserView, SingleUserView
from .views.groupView import GroupView
from django.urls import path

urlpatterns = [
    path("user", UserView.as_view(), name = "user"),
    path("user/<userid>", SingleUserView.as_view(), name = "singleUser"),
    path("group", GroupView.as_view(), name = "group"),
]
