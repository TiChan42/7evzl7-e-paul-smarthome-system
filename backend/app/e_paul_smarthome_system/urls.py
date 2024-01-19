from django import urls

from .views.userView import UserView, SingleUserView
from .views.accountView import AccountView
from django.urls import path

urlpatterns = [
    path("user", UserView.as_view(), name = "user"),
    path("user/<userid>", SingleUserView.as_view(), name = "singleUser"),
    path("account", AccountView.as_view(), name = "group"),
]
