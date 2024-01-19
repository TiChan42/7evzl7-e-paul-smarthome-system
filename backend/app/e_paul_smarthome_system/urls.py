from django import urls

from .views.userView import UserView, SingleUserView
from .views.accountView import AccountView
from .views.about_us import AboutUsView
from django.urls import path

urlpatterns = [
    path("user", UserView.as_view(), name = "user"),
    path("user/<userid>", SingleUserView.as_view(), name = "singleUser"),
    path("account", AccountView.as_view(), name = "group"),
    path("about_us", AboutUsView.as_view(), name="aboutUs")
]
